export const verificationTemplate = (verificationLink: string) =>
    `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #4CAF50; text-align: center;">Welcome to Local Event Finder!</h2>
            <p>Thank you for registering. To complete your setup, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 14px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">Verify Email Address</a>
            </div>

            <p style="font-size: 13px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                This link will expire in 24 hours. If you did not create an account, please ignore this email.
            </p>
        </div>        `
    ;

export const forgotPasswordTemplate = (resetLink: string) =>
    `
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
        `
    ;

export const approvalTemplate = (name: string) =>
    `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #4CAF50; text-align: center;">Account Approved!</h2>
            <p>Hello <b>${name}</b>,</p>
            <p>We are excited to inform you that your application to become an organizer on <strong>Local Event Finder</strong> has been approved by our admin team.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                <p style="margin: 0;">You can now log in to your dashboard to start creating and managing events.</p>
            </div>

            <p style="font-size: 13px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                Welcome to the community! We can't wait to see your events.
            </p>
        </div>
        `
    ;

export const rejectionTemplate = (name: string) =>
    `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #f44336; text-align: center;">Application Update</h2>
            <p>Hello <b>${name}</b>,</p>
            <p>Thank you for your interest in joining Local Event Finder. After reviewing your application, we regret to inform you that we cannot approve your organizer account at this time.</p>
            
            <p>If you have any questions regarding this decision, please feel free to reach out to our support team.</p>

            <p style="font-size: 13px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                Best regards,<br>The Local Event Finder Team
            </p>
        </div>
        `
    ;       