import sgMail from "@sendgrid/mail";
import { ENV } from "../config/env";

sgMail.setApiKey(ENV.SENDGRID_API_KEY as string);

export const sendVerificationEmail = async (email:string ,   verificationLink: string) => {
      
        const message = {
            to : email,
            from: ENV.SENDGRID_FROM_EMAIL as string,
             subject: "Verify your email",
            html: `
            <h3>Email Verification</h3>
            <p>Please click the link below to verify your account:</p>
            <a href="${verificationLink}">Verify Email</a>
            `
        };
        
        await sgMail.send(message);
}