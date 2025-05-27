import User from "../models/user.Model.js";
import { OTP } from "../models/otp.Model.js"; 
import { sendOTPEmail } from "../lib/nodeMailer.js"; 


export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(404).json({ message: "User alredy exist" });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

        await OTP.deleteMany({ email });

        const newOTP = new OTP({
            email,
            otp: otpCode,
            expiresAt,
            isUsed: false
        });

        await newOTP.save();

        await sendOTPEmail(email, otpCode);

        res.status(200).json({ 
            message: "OTP sent successfully to your email",
            expiresIn: "3 minutes"
        });

    } catch (error) {
        console.log("Error in sendOTP controller:", error);
        res.status(500).json({ message: "Error sending OTP" });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const otpRecord = await OTP.findOne({ 
            email, 
            otp, 
            isUsed: false 
        });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ message: "OTP has expired" });
        }

        otpRecord.isUsed = true;
        await otpRecord.save();

        await User.findOneAndUpdate(
            { email }, 
            { isEmailVerified: true },
            { new: true }
        );

        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ 
            message: "OTP verified successfully",
            verified: true
        });

    } catch (error) {
        console.log("Error in verifyOTP controller:", error);
        res.status(500).json({ message: "Error verifying OTP" });
    }
};

export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(404).json({ message: "User alredy exist try loging in" });
        }

        const recentOTP = await OTP.findOne({
            email,
            createdAt: { $gt: new Date(Date.now() - 1 * 60 * 1000) } // 1 minute ago
        });

        if (recentOTP) {
            return res.status(429).json({ 
                message: "Please wait before requesting a new OTP",
                retryAfter: "1 minute"
            });
        }
     
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTP.deleteMany({ email });

        const newOTP = new OTP({
            email,
            otp: otpCode,
            expiresAt,
            isUsed: false
        });

        await newOTP.save();

        await sendOTPEmail(email, otpCode);

        res.status(200).json({ 
            message: "New OTP sent successfully",
            expiresIn: "3 minutes"
        });

    } catch (error) {
        console.log("Error in resendOTP controller:", error);
        res.status(500).json({ message: "Error resending OTP" });
    }
};

export const cleanupExpiredOTPs = async () => {
    try {
        const result = await OTP.deleteMany({
            expiresAt: { $lt: new Date() }
        });
        
        console.log(`Cleaned up ${result.deletedCount} expired OTPs`);
        return result;
    } catch (error) {
        console.log("Error cleaning up expired OTPs:", error);
        throw error;
    }
};