import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: true,
        length: 6
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } 
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    attempts: {
        type: Number,
        default: 0,
        max: 3 
    }
}, {
    timestamps: true
});

otpSchema.index({ email: 1, otp: 1 });
otpSchema.index({ email: 1, isUsed: 1 });

export const OTP = mongoose.model("OTP", otpSchema);