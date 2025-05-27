import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";

export const OTPstore = create((set, get) => ({

    sedndOTP: async (email) => {
        try {

            const res = await axiosInstance.post("/sendOTP",{email});
            const data = res.data.message;

            toast.success(data);

        } catch (error) {

            toast.error("Unable to send OTP");
            console.log(error);


        }
    },

    verifyOTP: async (email, otp) => {
        try {
            const res = await axiosInstance.post("/verifyOTP", {
                email,
                otp
            });

            const data = res.data.verified;

            if (data === true) {
                toast.success("OTP verified successfully")
            }

        } catch (error) {

            const status = error?.response?.status;
            const msg = error?.response?.data?.message;

            if (status === 400) {
                toast.warning(msg)
            } else {
                toast.error(msg)
            }

        }
    },

    resendOTP: async (email) => {
        try {

            const res = await axiosInstance.post("/resendOTP",{email});

            toast.success("New OTP sent successfully")

        } catch (error) {

            const msg = error?.response?.data?.message;
            const status = error?.response?.status;

            if (status === 400) {
                toast.warning(msg);
            } else if (status === 429) {
                toast.warning(msg);
            } else {
                toast.error(msg);
            }

            console.log(error);

        }
    }
}))