
import { axiosInstance } from "@/lib/axios.js";
import { create } from "zustand";
import { toast } from "sonner";

export const useAuthStore = create((set,get)=>({
    login:async(data)=>{
        try {
            const res=await axiosInstance.post("/auth/login",data)
            toast.success('logged in successfully');
            console.log("success")
        } catch (error) {
            toast.error("Invalid credentials")
            console.log(error.message)
        }
    }
}))