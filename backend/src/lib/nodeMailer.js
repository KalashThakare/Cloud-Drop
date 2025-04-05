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