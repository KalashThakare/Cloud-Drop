import { axiosInstance } from "@/lib/axios.js";
import { create } from "zustand";
import {toast} from "sonner";

export const useAuthStore = create((set)=>({
    authUser:null,
    isloggingin:false,

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
        set({isloggingin:true})
        try {
            const res=await axiosInstance.post("/auth/login",data)
            set({authUser:res.data});
            toast.success('logged in successfully');
            return res.data;
        } catch (error) {
            set({authUser:null});
            toast.error("Invalid credentials")
            console.log(error.message)
            return null;
        }finally{
            set({isloggingin:false})
        }
    },

    logout:async()=>{
        try {
            const res=await axiosInstance.post("/auth/logout");
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
            toast.success('Signed up Successfully');
            return 1;
        } catch (error) {
            toast.error('Error');
        }
    }
}))