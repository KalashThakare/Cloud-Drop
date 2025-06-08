import { axiosInstance } from "@/lib/axios.js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { io } from "socket.io-client";
// import router from "next/router";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/errorUtils";

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

        const newSocket = io("https://backend.clouddrop.pro", {
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
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data) {
            set({ authUser: res.data, isloggingin: false });
            get().connectSocket(); // 🔌 connect socket after auth
          } else {
            set({ authUser: null, isloggingin: false });
          }
        } catch (error) {
          const status = error?.response?.status;
          if (status === 401 || status === 403) {
            toast.warning(getErrorMessage(error, "Session expired. Please login again."));
          } else {
            toast.error(getErrorMessage(error, "Failed to check authentication"));
          }
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
          get().connectSocket();
          toast.success("Logged in successfully");
          return res.data;
        } catch (error) {
          set({ authUser: null, isloggingin: false });
          const status = error?.response?.status;
          if (status === 400 || status === 401) {
            toast.warning(getErrorMessage(error, "Invalid credentials"));
          } else {
            toast.error(getErrorMessage(error, "Login failed"));
          }
          return null;
        }
      },

      // 🚪 Logout
      logout: async () => {
        set({ isloggingin: true });
        try {
          await axiosInstance.post("/auth/logout");
          toast.success("Logged out successfully");
        } catch (error) {
          const status = error?.response?.status;
          if (status === 401) {
            toast.warning(getErrorMessage(error, "You are already logged out"));
          } else {
            toast.error(getErrorMessage(error, "Logout failed"));
          }
        } finally {
          localStorage.removeItem("authToken");
          get().disconnectSocket();
          set({ authUser: null, isloggingin: false });
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
          get().connectSocket();
          toast.success("Signed up Successfully");
          return 1;
        } catch (error) {
          set({ isloggingin: false });
          const status = error?.response?.status;
          if (status === 400) {
            toast.warning(getErrorMessage(error, "Signup failed"));
          } else {
            toast.error(getErrorMessage(error, "Error during signup"));
          }
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
