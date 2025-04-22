import { axiosInstance } from "@/lib/axios.js";
import { create } from "zustand";
import { persist } from "zustand/middleware"; 
import { toast } from "sonner";
import router from "next/router";



export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      isloggingin: true, 
      
      checkAuth: async() => {
        set({ isloggingin: true });
        try {
         
          const token = localStorage.getItem("authToken");
          
          if (!token) {
            set({authUser: null, isloggingin: false});
            router.push("/Auth");
            return;
          }
          
          const res = await axiosInstance.get("/auth/check", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.data) {
            set(state => ({authUser: res.data, isloggingin: false}));
          } else {
            set({authUser: null, isloggingin: false});
          }
        } catch (error) {
          localStorage.removeItem("authToken"); 
          set({authUser: null, isloggingin: false});
          localStorage.removeItem("useDefaultAfterLogin");
          router.push("/Auth");
        }
      },

      login: async(data) => {
        set({isloggingin: true});
        try {
          const res = await axiosInstance.post("/auth/login", data);
          if (res.data && res.data.token) {
            localStorage.setItem("authToken", res.data.token);
          }
          set({authUser: res.data, isloggingin: false});
          toast.success('Logged in successfully');
          return res.data;
        } catch (error) {
          set({authUser: null, isloggingin: false});
          toast.error("Invalid credentials");
          return null;
        }
      },

      logout: async() => {
        set({isloggingin: true});
        try {
          await axiosInstance.post("/auth/logout");
          localStorage.removeItem("authToken");
          set({authUser: null, isloggingin: false});
          toast.success('Logged out successfully');
        } catch (error) {
          localStorage.removeItem("authToken"); 
          set({authUser: null, isloggingin: false});
          toast.error('Error during logout');
        }
      },

      signup: async(data) => {
        set({isloggingin: true});
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          if (res.data && res.data.token) {
            localStorage.setItem("authToken", res.data.token);
          }
          set({authUser: res.data, isloggingin: false});
          toast.success('Signed up Successfully');
          return 1;
        } catch (error) {
          set({isloggingin: false});
          toast.error('Error during signup');
          return 0;
        }
      }
    }),
    {
      name: "auth-storage", 
      partialize: (state) => ({ 
        authUser: state.authUser, 
      }),
    }
  )
);