import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"kalashthakare898@gmail.com",
        pass:process.env.PASSKEY
    }
})

export const sendVerificationEmail=async(email, link)=> {
    const mailOptions = {
        from: "kalashthakare898@gmail.com",
        to: email,
        subject: "Secure File Access Verification",
        text: `Click this link to verify your access:\n${link}\n\nThis link is valid for one use only.`,
    };
    await transporter.sendMail(mailOptions);
}

export const sendUrl=async(email,url)=>{

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
                                Click the link above or copy and paste it into your browser address bar to access your file.
                            </p>
                        </div>
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
        subject: "Your Secure File Link",
        text: `Here is your secure file link:\n ${url}`,
        html:htmlBody
    });
}

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