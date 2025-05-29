import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { toast } from "sonner";

export const subscriptionHandler = create((set, get) => ({

    subscription: null,
    usageStats: null,
    loading: false,
    error: null,

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    getSubscription: async (userId) => {
        try {
            set({ loading: true, error: null });
            
            const res = await axiosInstance.post("/get-subscription", {
                userId
            });

            const subscription = res.data;
            set({ subscription, loading: false });
            return subscription;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to get subscription";
            set({ error: errorMessage, loading: false });
            throw error;
        }
    },

    getUsageStats: async (userId) => {
        try {
            set({ loading: true, error: null });
            
            const res = await axiosInstance.post("/usage-stats", {
                userId
            });

            const stats = res.data;
            set({ usageStats: stats, loading: false });
            return stats;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to get usage stats";
            set({ error: errorMessage, loading: false });
            throw error;
        }
    },

    checkLimits: async (userId, action) => {
        try {
            const res = await axiosInstance.post("/check-limits", {
                userId,
                action
            });

            const data = res.data;
            console.log("Check limits response:", data);
            return data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to check limits";
            console.error("Check limits error:", errorMessage);
            toast.error(errorMessage);
            throw error;
        }
    },

    incrementUsage: async (userId, action) => {
        try {
    
            const res = await axiosInstance.post("/increment-usage", {
                userId,
                action
            });

            const data = res.data;
            console.log("Increment usage response:", data);
            // Update local usage stats if available
            const currentStats = get().usageStats;
            if (currentStats && action === "upload") {
                const updatedStats = {
                    ...currentStats,
                    uploads: {
                        ...currentStats.uploads,
                        used: (currentStats.uploads?.used || 0) + 1
                    }
                };
                set({ usageStats: updatedStats });
            }
            
            return data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to increment usage";
            toast.error(errorMessage);
            throw error;
        }
    },

    upgradeToPro: async (userId) => {
        try {
            set({ loading: true, error: null });
            
            const res = await axiosInstance.post("/upgrade-to-pro", {
                userId
            });

            const data = res.data;
            
            set({ 
                subscription: { ...get().subscription, type: 'pro' },
                loading: false 
            });
            
            toast.success("Successfully upgraded to Pro!");
            return data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to upgrade to Pro";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    downgradeToFree: async (userId) => {
        try {
            set({ loading: true, error: null });
            
            const res = await axiosInstance.post("/downgrade-to-free", {
                userId
            });

            const data = res.data;
            
            set({ 
                subscription: { ...get().subscription, type: 'free' },
                loading: false 
            });
            
            toast.success("Successfully downgraded to Free plan");
            return data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to downgrade to Free";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    },

    resetUsage: async (userId) => {
        try {
            set({ loading: true, error: null });
            
            const res = await axiosInstance.post("/reset-usage", {
                userId
            });

            const data = res.data;
            
            const currentStats = get().usageStats;
            if (currentStats) {
                const resetStats = {
                    ...currentStats,
                    uploads: {
                        ...currentStats.uploads,
                        used: 0
                    }
                };
                set({ usageStats: resetStats });
            }
            
            set({ loading: false });
            toast.success("Usage stats reset successfully!");
            return data;
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to reset usage";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
            throw error;
        }
    }
}));