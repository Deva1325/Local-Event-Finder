import sgMail from "@sendgrid/mail";
import { ENV } from "../config/env";

sgMail.setApiKey(ENV.SENDGRID_API_KEY as string);

export const sendVerificationEmail = async (email:string ,   verificationLink: string) => {
      
        const message = {
            to : email,
            from: ENV.SENDGRID_FROM_EMAIL as string,
             subject: "Verify your Event Finder Account",
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome to Local Event Finder!</h2>
                <p>Thank you for registering. Please click the button below to verify your email address and activate your account:</p>
                <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
                <p>If the button doesn't work, copy and paste this link: ${verificationLink}</p>
            </div>`,
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
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password. Click the button below to set a new one. <b>This link expires in 1 hour.</b></p>
            <a href="${resetLink}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
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