import sgMail from "@sendgrid/mail";
import { ENV } from "../config/env";

sgMail.setApiKey(ENV.SENDGRID_API_KEY as string);

export const sendVerificationEmail = async (email:string ,   verificationLink: string) => {
      
        const message = {
            to : email,
            from: ENV.SENDGRID_FROM_EMAIL as string,
             subject: "Verify your Event Finder Account",
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #4CAF50; text-align: center;">Welcome to Local Event Finder!</h2>
            <p>Thank you for registering. To complete your setup, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">Verify Email Address</a>
            </div>

            <p style="font-size: 13px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                This link will expire in 24 hours. If you did not create an account, please ignore this email.
            </p>
        </div>
            `,
            trackingSettings: {
            clickTracking: {
                enable: false,
                enableText: false
            }
        }
        };
        
        await sgMail.send(message);
}

export const sendForgotPasswordEmail= async (email:string,resetLink:string) => {
    const message = { 
        to: email,
        from: ENV.SENDGRID_FROM_EMAIL as string,
        subject: "Reset Your Password",
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #f44336; text-align: center;">Password Reset Request</h2>
            
            <p>We received a request to reset the password for your Local Event Finder account.</p>
            
            <p style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #f44336; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">Set New Password</a>
            </p>

            <div style="background-color: #fff4f3; padding: 15px; border-left: 4px solid #f44336; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: #d32f2f;">
                    <strong>Security Note:</strong> This link will expire in <b>1 hour</b> for your protection. 
                </p>
            </div>

            <p style="font-size: 13px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                If you did not request a password reset, please ignore this email or contact support if you have concerns.
            </p>
        </div>
        `,
        trackingSettings: {
            clickTracking: {
                enable: false,
                enableText: false
            }
        }
    };
    await sgMail.send(message);
}

/*        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Click the button below to set a new one. <b>This link expires in 1 hour.</b></p>
            <a href="${resetLink}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        </div>

*/