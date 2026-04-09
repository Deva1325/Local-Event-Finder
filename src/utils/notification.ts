import sgMail from "@sendgrid/mail";
import { ENV } from "../config/env";
import { isValidEmail } from "../utils/validator";
import { verificationTemplate, forgotPasswordTemplate, approvalTemplate, rejectionTemplate } from "../templates/emailTemplates";

sgMail.setApiKey(ENV.SENDGRID_API_KEY as string);

const emailConfig = {
    from: ENV.SENDGRID_FROM_EMAIL as string,
    trackingSettings: {
        clickTracking: {
            enable: false,
            enableText: false
        }
    }
}

export const sendVerificationEmail = (email: string, verificationLink: string) => {

    const message = {
        to: email,
        ...emailConfig,
        subject: "Verify your Event Finder Account",
        html: verificationTemplate(verificationLink)
    };
    if (!isValidEmail(email)) {
        console.log("Invalid email: ", email);
        return;
    }

    sgMail.send(message).catch((error) => {
        console.log("Send verification email error: ", error);
    });

}

export const sendForgotPasswordEmail = (email: string, resetLink: string) => {
    const message = {
        to: email,
        ...emailConfig,
        subject: "Reset Your Password",
        html: forgotPasswordTemplate(resetLink)

    };

    if (!isValidEmail(email)) {
        console.log("Invalid email: ", email);
        return;
    }

    sgMail.send(message).catch((error) => {
        console.log("Send forgetpassword email error: ", error);
    });
    //await sgMail.send(message);
}

export const sendApprovalEmail = (email: string, name: string) => {
    const message = {
        to: email,
        ...emailConfig,
        subject: "Congratulations! Your Organizer Account is Approved",
        html: approvalTemplate(name)
    }
    if (!isValidEmail(email)) {
        console.log("Invalid email: ", email);
        return;
    }

    sgMail.send(message).catch((error) => {
        console.log("Send approve email error: ", error);
    });
}

export const sendRejectionEmail = (email: string, name: string) => {
    const message = {
        to: email,
        ...emailConfig,
        subject: "Update regarding your Organizer Application",
        html: rejectionTemplate(name)
    }
    if (!isValidEmail(email)) {
        console.log("Invalid email: ", email);
        return;
    }

    sgMail.send(message).catch((error) => {
        console.log("Send reject email error: ", error);
    });
}