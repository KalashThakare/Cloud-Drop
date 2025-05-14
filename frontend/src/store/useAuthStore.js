import { axiosInstance } from "@/lib/axios.js";
import { create } from "zustand";
import { persist } from "zustand/middleware"; 
import { toast } from "sonner";
import { io } from "socket.io-client";
// import router from "next/router";
import { useRouter } from "next/navigation";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isloggingin: true,
      socket: null,
      onLineUsers: [],

      // 🔌 Connect Socket.IO
      connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        const newSocket = io("http://localhost:4000", {
          query: { userId: authUser._id },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        newSocket.connect();

        newSocket.off("getOnlineUsers");
        newSocket.on("getOnlineUsers", (userIds) => {
          set({ onLineUsers: userIds });
        });

        set({ socket: newSocket });
      },

      // 🔌 Disconnect Socket.IO
      disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) {
          socket.disconnect();
          set({ socket: null, onLineUsers: [] });
        }
      },

      // 🔐 Check Auth
      checkAuth: async (router) => {
        set({ isloggingin: true });
        try {
          const token = localStorage.getItem("authToken");

          if (!token) {
            set({ authUser: null, isloggingin: false });
            router.push("/Auth");
            return;
          }

          const res = await axiosInstance.get("/auth/check", {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (res.data) {
            set({ authUser: res.data, isloggingin: false });
            get().connectSocket(); // 🔌 connect socket after auth
          } else {
            set({ authUser: null, isloggingin: false });
          }
        } catch (error) {
          localStorage.removeItem("authToken");
          set({ authUser: null, isloggingin: false });
          localStorage.removeItem("useDefaultAfterLogin");
          router.push("/Auth");
        }
      },

      // 🔑 Login
      login: async (data) => {
        set({ isloggingin: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          if (res.data?.token) {
            localStorage.setItem("authToken", res.data.token);
          }
          set({ authUser: res.data, isloggingin: false });
          get().connectSocket(); // 🔌 connect socket
          toast.success('Logged in successfully');
          return res.data;
        } catch (error) {
          set({ authUser: null, isloggingin: false });
          toast.error("Invalid credentials");
          return null;
        }
      },

      // 🚪 Logout
      logout: async () => {
        set({ isloggingin: true });
        try {
          await axiosInstance.post("/auth/logout");
        } catch (error) {
          toast.error('Error during logout');
        } finally {
          localStorage.removeItem("authToken");
          get().disconnectSocket(); // 🔌 disconnect socket
          set({ authUser: null, isloggingin: false });
          toast.success('Logged out successfully');
        }
      },

      // 📝 Signup
      signup: async (data) => {
        set({ isloggingin: true });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          if (res.data?.token) {
            localStorage.setItem("authToken", res.data.token);
          }
          set({ authUser: res.data, isloggingin: false });
          get().connectSocket(); // 🔌 connect after signup
          toast.success('Signed up Successfully');
          return 1;
        } catch (error) {
          set({ isloggingin: false });
          toast.error('Error during signup');
          return 0;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        authUser: state.authUser,
      }),
    }
  )
);
