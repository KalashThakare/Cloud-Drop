import { axiosInstance } from "@/lib/axios.js";
import { create } from "zustand";
import {toast} from "sonner";

export const useAuthStore = create((set,get)=>({
    authUser:null,

    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data})
        } catch (error) {
            console.log(error);
            set({authUser:null});
        }
    },

    login:async(data)=>{
        try {
            const res=await axiosInstance.post("/auth/login",data)
            set({authUser:res.data});
            toast.success('logged in successfully');
            console.log("success")
        } catch (error) {
            set({authUser:null});
            toast.error("Invalid credentials")
            console.log(error.message)
        }
    },

    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success('logged out successfully');
        } catch (error) {
            toast.error('Error');
        }
    },

    signup:async(data)=>{
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success('Signed In');
        } catch (error) {
            toast.error('Error');
        }
    }
}))