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
    await transporter.sendMail({
        from: "your-email@gmail.com",
        to: email,
        subject: "Your Secure File Link",
        text: `Here is your secure file link:\n ${url}`,
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