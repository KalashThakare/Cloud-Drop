import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "clouddrop.s3@gmail.com",
    pass: process.env.PASSKEY
  }
})

export const sendVerificationEmail = async (email, link) => {
  const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your File Access Request</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                <div style="background-color: rgba(255,255,255,0.1); width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 600;">Verify File Access</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 15px;">Confirm your request to access the secure file</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1e293b; margin: 0 0 15px; font-size: 22px; font-weight: 600;">Almost There!</h2>
                    <p style="color: #64748b; margin: 0; font-size: 16px; line-height: 1.6;">
                        To ensure secure access to your file, please verify your request by clicking the verification link below.
                    </p>
                </div>

                <!-- Steps Process -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 30px 0;">
                    <h3 style="color: #1e293b; margin: 0 0 20px; font-size: 16px; font-weight: 600; text-align: center;">What happens next:</h3>
                    
                    <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                        <div style="background-color: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 15px; flex-shrink: 0;">1</div>
                        <div>
                            <h4 style="color: #1e293b; margin: 0 0 5px; font-size: 14px; font-weight: 600;">Click Verification Link</h4>
                            <p style="color: #64748b; margin: 0; font-size: 13px; line-height: 1.4;">Click the secure verification button below to confirm your identity</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start; margin-bottom: 20px;">
                        <div style="background-color: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 15px; flex-shrink: 0;">2</div>
                        <div>
                            <h4 style="color: #64748b; margin: 0 0 5px; font-size: 14px; font-weight: 600;">Verification Complete</h4>
                            <p style="color: #64748b; margin: 0; font-size: 13px; line-height: 1.4;">You'll see a confirmation message in your browser</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: flex-start;">
                        <div style="background-color: #6b7280; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; margin-right: 15px; flex-shrink: 0;">3</div>
                        <div>
                            <h4 style="color: #64748b; margin: 0 0 5px; font-size: 14px; font-weight: 600;">Receive File Link</h4>
                            <p style="color: #64748b; margin: 0; font-size: 13px; line-height: 1.4;">A new email with your secure file link will be sent within moments</p>
                        </div>
                    </div>
                </div>

                <!-- Verification Button -->
                <div style="text-align: center; margin: 35px 0;">
                    <a href="${link}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.39);">
                        <svg style="display: inline-block; vertical-align: middle; margin-right: 8px;" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Verify My Request
                    </a>
                </div>

                <!-- Important Notice -->
                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 18px; border-radius: 6px; margin: 30px 0;">
                    <div style="display: flex; align-items: flex-start;">
                        <svg style="margin-right: 12px; margin-top: 2px; flex-shrink: 0;" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <div>
                            <h4 style="color: #92400e; margin: 0 0 6px; font-size: 15px; font-weight: 600;">Important</h4>
                            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
                                This verification link is <strong>valid for one use only</strong>. After clicking, you'll receive your file access link in a separate email within a few minutes.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Alternative Link -->
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin: 0 0 10px; font-size: 14px;">
                        Button not working? Copy and paste this link:
                    </p>
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; word-break: break-all; font-family: 'Consolas', 'Monaco', monospace; font-size: 12px; color: #475569;">
                        ${link}
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; margin: 0 0 8px; font-size: 14px;">
                    This is an automated verification email. Please do not reply.
                </p>
                <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                    If you did not request file access, please ignore this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

  const mailOptions = {
    from: "kalashthakare898@gmail.com",
    to: email,
    subject: "Verify Your File Access Request",
    text: `Click this link to verify your access:\n\n${link}\n\nThis link is valid for one use only.\n\nAfter verification, you'll receive another email with your secure file link.`,
    html: htmlBody,
  };

  await transporter.sendMail(mailOptions);
};

export const sendUrl = async (email, url, expiration) => {
  const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Secure File Link</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <div style="background-color: rgba(255,255,255,0.1); width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="white" stroke-width="2"/>
                        <circle cx="12" cy="16" r="1" fill="white"/>
                        <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="white" stroke-width="2"/>
                    </svg>
                </div>
                <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 600;">Secure File Link</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 15px;">Access your file securely</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #1e293b; margin: 0 0 15px; font-size: 22px; font-weight: 600;">Your File Link is Ready</h2>
                    <p style="color: #64748b; margin: 0; font-size: 16px; line-height: 1.6;">
                        Here is your secure file access link. Click or copy the link below to access your file.
                    </p>
                </div>

                <!-- Expiration Alert -->
                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 18px; border-radius: 6px; margin: 0 0 30px 0;">
                    <div style="display: flex; align-items: flex-start;">
                        <svg style="margin-right: 12px; margin-top: 2px; flex-shrink: 0;" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#f59e0b" stroke-width="2"/>
                            <polyline points="12,6 12,12 16,14" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <div>
                            <h4 style="color: #92400e; margin: 0 0 6px; font-size: 15px; font-weight: 600;">⏰ Time Sensitive</h4>
                            <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
                                This secure link will <strong>expire in ${expiration}mins</strong>. Please access your file promptly to avoid losing access.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Link Box -->
                <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
                    <div style="margin-bottom: 20px;">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #3b82f6;">
                            <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14 11C13.5705 10.4259 13.0226 9.95089 12.3934 9.60712C11.7643 9.26335 11.0685 9.05893 10.3533 9.00775C9.63819 8.95656 8.92037 9.05977 8.24864 9.31031C7.5769 9.56085 6.96687 9.95302 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06798 18.288 2.59382 19.5421 3.52086 20.4691C4.44791 21.3962 5.70197 21.922 7.01295 21.9334C8.32393 21.9448 9.58694 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div style="background-color: white; border: 1px solid #d1d5db; border-radius: 8px; padding: 15px; word-break: break-all; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; color: #374151; line-height: 1.4;">
                        <a href="${url}" style="color: #3b82f6; text-decoration: none;">${url}</a>
                    </div>
                </div>

                <!-- Instructions -->
                <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 18px; border-radius: 6px; margin: 30px 0;">
                    <div style="display: flex; align-items: flex-start;">
                        <svg style="margin-right: 12px; margin-top: 2px; flex-shrink: 0;" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#3b82f6" stroke-width="2"/>
                            <path d="M12 16V12M12 8H12.01" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <div>
                            <h4 style="color: #1e40af; margin: 0 0 6px; font-size: 15px; font-weight: 600;">How to Access</h4>
                            <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.5;">
                                Click the link above or copy and paste it into your browser address bar to access your file. Remember to download before the expiration time.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Security Notice -->
                <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 16px; border-radius: 6px; margin: 20px 0;">
                    <div style="display: flex; align-items: flex-start;">
                        <svg style="margin-right: 10px; margin-top: 2px; flex-shrink: 0;" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#64748b" stroke-width="2"/>
                            <path d="M9 12L11 14L15 10" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p style="color: #475569; margin: 0; font-size: 13px; line-height: 1.4;">
                            <strong>Security:</strong> This link is unique to you and should not be shared with others. It provides temporary access to your file and will automatically expire on the date shown above.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; margin: 0 0 8px; font-size: 14px;">
                    This is an automated message. Please do not reply to this email.
                </p>
                <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                    If you did not request this file, please ignore this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

  await transporter.sendMail({
    from: "your-email@gmail.com",
    to: email,
    subject: `🔒 Your Secure File Link (Expires: ${expiration})`,
    text: `Here is your secure file link:\n\n${url}\n\n⚠️ IMPORTANT: This link will expire in ${expiration} mins. Please access your file before this time.`,
    html: htmlBody
  });
};

export const sendOTPEmail = async (email, otpCode) => {
  try {
    const subject = "Your OTP Verification Code";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Email Verification</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #333; margin-top: 0;">Hello User!</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for signing up! Please use the following verification code to complete your registration:
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <h1 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 6px; font-family: 'Courier New', monospace;">
                ${otpCode}
              </h1>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>⚠️ Important:</strong> This code will expire in <strong>3 minutes</strong>. 
                Please do not share this code with anyone.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you didn't request this verification code, please ignore this email or contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      `;

    await transporter.sendMail({
      to: email,
      subject: subject,
      html: htmlContent
    });

    console.log(`OTP sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.log("Error sending OTP email:", error);
    throw error;
  }
};