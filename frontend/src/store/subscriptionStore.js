import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { toast } from "sonner";

export const subscriptionStore = create((set, get) = ({

    selectedPlan: null,
    plans: [],

    getPlans: async () => {
        try {
            const res = await axiosInstance.get("/subscription/plans");
            const data = res.data;
            set({ plans: data });

            if (data.length > 0) {
                set({ selectedPlan: data[0]._id });
            }
            
        } catch (error) {
            console.log(error);
            set({ plans: [] });
        }
    },

    subscribeToPlan: async ({ userId, planId }) => {
        try {

            const res = await axiosInstance.post("/subscriptions/subscribe", {
                userId,
                planId
            });

            toast.success("Subscription successful! Welcome aboard.");

        } catch (error) {

            console.log(error);
            toast.error("Something went wrong. Please try again.");

        }
    }
}))
