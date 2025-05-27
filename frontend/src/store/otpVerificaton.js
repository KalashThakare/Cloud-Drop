import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const OTPstore = create((set, get) => ({
  sendOTP: async (email) => {
    try {
      const res = await axiosInstance.post("/sendOTP", { email });
      toast.success(res.data.message || "OTP sent successfully");
      return true;
    } catch (error) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message || "Unable to send OTP";
      if (status === 400) {
        toast.warning(msg); // Email is required
      } else if (status === 404) {
        toast.warning(msg); // User already exists
      } else {
        toast.error(msg);
      }
      return false;
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const res = await axiosInstance.post("/verifyOTP", { email, otp });
      if (res.data.verified === true) {
        toast.success(res.data.message || "OTP verified successfully");
        return true;
      } else {
        toast.warning(res.data.message || "OTP verification failed");
        return false;
      }
    } catch (error) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message || "OTP verification failed";
      if (status === 400) {
        toast.warning(msg); // Invalid OTP, expired, or missing fields
      } else {
        toast.error(msg);
      }
      return false;
    }
  },

  resendOTP: async (email) => {
    try {
      const res = await axiosInstance.post("/resendOTP", { email });
      toast.success(res.data.message || "New OTP sent successfully");
      return true;
    } catch (error) {
      const status = error?.response?.status;
      const msg = error?.response?.data?.message || "Unable to resend OTP";
      if (status === 400) {
        toast.warning(msg); // Email is required
      } else if (status === 404) {
        toast.warning(msg); // User already exists
      } else if (status === 429) {
        toast.warning(msg); // Rate limit
      } else {
        toast.error(msg);
      }
      return false;
    }
  },
}));
