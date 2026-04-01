import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { isValidEmail, isEmpty } from "../utils/validator";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../core/JWT";
import { generateToken } from "../utils/helpers";
import { ENV } from "../config/env";
import { sendVerificationEmail, sendForgotPasswordEmail } from "../utils/notification";
import { successResponse, errorResponse } from "../utils/response";
import { logAudit } from '../utils/auditLogger';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (isEmpty(name) || isEmpty(email) || isEmpty(password)) {
      return errorResponse(res, "Name, email and password are required", 400);
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, "Invalid email format", 400);
    }

    if (password.length < 8) {
      return errorResponse(res, "Password must be at least 8 characters long", 400);
    }

    const allowedRoles = ["user", "organizer"];
    if (role && !allowedRoles.includes(role)) {
      return errorResponse(res, "Invalid role selected", 400);
    }

    //   if (req.body.role) {
    //     return errorResponse(res, "Role assignment not allowed during registration", 403);
    // }

    //paranoid: false - if the user is deleted and then again register with same email
    const existingUser = await UserModel.findOne({
      where: { email }
      //paranoid : false
    });


    if (existingUser) {
      return errorResponse(res, "Email already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //const user=await UserModel.create(req.body);    
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "user",
      is_verified: false,
      status: "active",
      organizer_status: role === "organizer" ? "pending" : null
    });

    //generate verification Token 
    const verificationToken = generateToken();

    //token expiry 
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    //save token in db
    await user.update({
      verification_token: verificationToken,
      verification_token_expiry: expiry
    });

    await logAudit({
      userId: user.user_id,
      action: "User_Registration",
      entityType: "User",
      entityId: user.user_id,
      description: `New ${user.role} registered with email: ${user.email}`,
      ipAddress: req.ip || null
    });

    //const networkIP = "192.168.1.103"; 

    //const verificationLink = `${ENV.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    const verificationLink = `${ENV.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendVerificationEmail(user.email, verificationLink);

    return successResponse(res, "User registered successfully, Please check your email", {
      userId: user.user_id,
      name: user.name,
      email: user.email
    }, 201);

  } catch (error) {
    console.error("Regtration Error: ", error);
    return errorResponse(res, "Internal server error");
  }

}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (isEmpty(email) || isEmpty(password)) {
      return errorResponse(res, "Email and Password are required!", 400);
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, "Invalid email format", 400);
    }

    const user = await UserModel.findOne({ where: { email } });


    if (!user) {
      return errorResponse(res, "Invalid email or password", 400);
    }

    if (!user.is_verified) {
      return errorResponse(res, "Please verify your email before login", 403);
    }

    if (user.role === "organizer" && user.organizer_status !== "approved") {
      return errorResponse(res, "Organizer account is not approved by admin", 403);
    }

    if (user.lock_until && new Date() < user.lock_until) {
      return errorResponse(res, "Account locked due to multiple failed attempts. Try again later.", 403);
    }

    const ispasswordValid = await bcrypt.compare(password, user.password);

    // if (!ispasswordValid) {
    //     return res.status(400).json({
    //     message: "Invalid password"
    // });
    // }

    if (!ispasswordValid) {
      let attempts = user.failed_login_attempts + 1;

      let lock_until = null;

      if (attempts >= 5) {
        lock_until = new Date(Date.now() + 30 * 60 * 1000); // 30 min
      }

      await user.update({
        failed_login_attempts: attempts,
        lock_until: lock_until
      });

      const msg = attempts >= 5
        ? "Account locked for 30 minutes."
        : `Invalid Password. Attempt ${attempts} of 5`;
      return errorResponse(res, msg, 400);
    }

    await user.update({
      failed_login_attempts: 0,
      lock_until: null
    });

    const accessToken = generateAccessToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      organizer_status: user.organizer_status
    });

    //Refresh Token
    const refreshToken = generateRefreshToken({
      user_id: user.user_id
    });

    //Store Refresh Token in DB
    await user.update({
      refresh_token: refreshToken
    })

    await logAudit({
      userId: user.user_id,
      action: "User_Login",
      entityType: "User",
      entityId: user.user_id,
      description: "User logged in successfully",
      ipAddress: req.ip || null
    });

    return successResponse(res, "Login successful", {
      accessToken: accessToken,
      refreshToken: refreshToken
    });

  } catch (error) {
    return errorResponse(res, "Internal server error");
  }
}

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, "Refresh Token is required!", 400);
    }

    //verify refresh token
    const decoded: any = verifyRefreshToken(refreshToken);

    if (!decoded || !decoded.user_id) {
      return errorResponse(res, "Invalid or expired refresh token", 400);
    }

    const user = await UserModel.findOne({
      where: { user_id: decoded.user_id }
    });

    if (!user) {
      return errorResponse(res, "User not found for the provided refresh token", 401);
    }

    if (user.refresh_token !== refreshToken) {
      return errorResponse(res, "Refresh Token mismatch", 403);
    }

    const newAccessToken = generateAccessToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      organizer_status: user.organizer_status
    });

    return successResponse(res, "New Access Token generated", { accessToken: newAccessToken });

  } catch (error) {
    console.error("Refresh Token error:", error);

    return errorResponse(res, "Invalid or expired refresh token", 403);

  }
}

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      return errorResponse(res, "Verification Token is required!", 400);
    }

    const user = await UserModel.findOne({ where: { verification_token: token } })

    if (!user) {
      return errorResponse(res, "Invalid verification token", 400);
    }

    // check expiry
    if (user.verification_token_expiry && new Date() > user.verification_token_expiry) {
      return errorResponse(res, "Verification token expired", 400);

    }

    await user.update({
      is_verified: true,
      verification_token: null,
      verification_token_expiry: null
    });

    await logAudit({
      userId: user.user_id,
      action: "Email_Verified",
      entityType: "User",
      entityId: user.user_id,
      description: "User successfully verified with email address",
      ipAddress: req.ip || null
    });

    return successResponse(res, "Email verified successfully");

  } catch (error) {
    return errorResponse(res, "Internal server error", 500);
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return errorResponse(res, "Refresh token is required", 400);
    }

    const user = await UserModel.findOne({
      where: { refresh_token }
    });

    if (!user) {
      return errorResponse(res, "Invalid Refresh token", 400);
    }

    //remove token from the db
    await user.update({
      refresh_token: null
    });

    await logAudit({
      userId: user.user_id,
      action: "User_Logout",
      entityType: "User",
      entityId: user.user_id,
      description: "User successfully logged out and cleared refresh token",
      ipAddress: req.ip || null
    });

    return successResponse(res, "Logout successful");

  } catch (error) {
    //console.error("Logout error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    //console.log(email);

    if (isEmpty(email)) {
      return errorResponse(res, "Email is required", 400);
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, "Please enter valid email format", 400);
    }

    const user = await UserModel.findOne({ where: { email } });

    //console.log(user);

    if (!user) {
      return errorResponse(res, "User with this email does not exist", 404);
    }

    //generate reset password token 
    const reset_token = generateToken();

    const reset_token_expiry = new Date(Date.now() + 60 * 60 * 1000);// 1 hour

    await user.update({
      reset_password_token: reset_token,
      reset_password_expiry: reset_token_expiry
    });

    await logAudit({
      userId: user.user_id,
      action: "Password_Reset_Requested",
      entityType: "User",
      entityId: user.user_id,
      description: "User requested a password reset -> password reset token generated and sent to email",
      ipAddress: req.ip || null
    });

    //const resetPassword_Link = `${ENV.BASE_URL}/api/auth/reset-password?token=${reset_token}`;
    const resetPassword_Link = `${ENV.FRONTEND_URL}/reset-password?token=${reset_token}`;

    //console.log(resetPassword_Link);

    await sendForgotPasswordEmail(user.email, resetPassword_Link);

    return successResponse(res, "Reset Password link sent to the email");


  } catch (error) {
    return errorResponse(res, "Internal server error", 500);

  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {

    const { token, password } = req.body;

    if (!token || !password) {
      return errorResponse(res, "Token and new password are required!", 400);
    }

    if (password.length < 8) {
      return errorResponse(res, "Password must be at least 8 characters long", 400);
    }
    const user = await UserModel.findOne({ where: { reset_password_token: token } });

    if (!user) {
      return errorResponse(res, "Invalid Reset Token", 400);
    }

    if (user.reset_password_expiry && new Date() > user.reset_password_expiry) {
      return errorResponse(res, "Reset Token Expired", 400);

    }

    const hashedNewPassword = await bcrypt.hash(password, 10);

    await user.update({
      password: hashedNewPassword,
      reset_password_token: null,
      reset_password_expiry: null
    });

    await logAudit({
      userId: user.user_id,
      action: "Password_Reset",
      entityType: "User",
      entityId: user.user_id,
      description: "User successfully reset their password via email token",
      ipAddress: req.ip || null
    });

    return successResponse(res, "Password reset successful!");

  } catch (error) {
    console.error("Reset Password error: ", error);

    return errorResponse(res, "Internal server error", 500);

  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userData = (req as any).user;

    const user = await UserModel.findOne({
      where: { user_id: userData.user_id },
      attributes: { exclude: ["password", "refresh_token", "verification_token", "verification_token_expiry", "reset_password_token", "reset_password_expiry"] }
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    return successResponse(res, "User profile fetched successfully", user);
  } catch (error) {
    console.error("Get Profile error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userData = (req as any).user;

    const { name, phone } = req.body;

    const user = await UserModel.findByPk(userData.user_id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    await user.update({
      name: name || user.name,
      phone: phone || user.phone
    });

    await logAudit({
      userId: user.user_id,
      action: "Profile_Updated",
      entityType: "User",
      entityId: user.user_id,
      description: "User updated their profile information",
      ipAddress: req.ip || null
    });

    return successResponse(res, "User profile updated successfully", user);

  } catch (error) {
    console.error("Update profile error: ", error);
    return errorResponse(res, "Internal server error", 500);
  }
}