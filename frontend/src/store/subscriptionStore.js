import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { toast } from "sonner";

export const subscriptionStore = create((set, get) => ({
    selectedPlan: null,
    plans: [],
    isLoading: false,

    getPlans: async () => {
        try {
            set({ isLoading: true });
            const res = await axiosInstance.get("/subscription/plans");
            const data = res.data;
            set({ plans: data });

            if (data.length > 0) {
                set({ selectedPlan: data[1]._id });
            }
            
        } catch (error) {
            console.log("getPlans error:", error);
            set({ plans: [] });
            toast.error("Failed to load plans");
        } finally {
            set({ isLoading: false });
        }
    },

    subscribeToPlan: async ({ userId, planId }) => {
        try {
            set({ isLoading: true });

            const res = await axiosInstance.post("/subscription/subscribe", {
                userId,
                planId
            });

            const data = res.data;

            // Handle free plan
            if (data.isFree) {
                toast.success("Subscribed to free plan successfully!");
                return;
            }

            console.log(data);

            // Handle paid plan - initialize Razorpay
            if (data.subscriptionId) {
                get().initiateRazorpayPayment(data.subscriptionId, data.planDetails, userId);
            }

        } catch (error) {
            console.log("subscribeToPlan error:", error);
            toast.error("Failed to initiate subscription. Please try again.");
        } finally {
            set({ isLoading: false });
        }
    },

    initiateRazorpayPayment: (subscriptionId, planDetails, userId) => {
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            subscription_id: subscriptionId,
            name: "Your App Name",
            description: `Subscription to ${planDetails.name}`,
            image: "/logo.png", // Your app logo
            handler: function(response) {
                // Payment successful
                get().handlePaymentSuccess(response, userId);
            },
            prefill: {
                name: "User Name", // You can get this from user context/store
                email: "user@example.com", // You can get this from user context/store
                contact: "9999999999" // You can get this from user context/store
            },
            notes: {
                address: "Your Corporate Office"
            },
            theme: {
                color: "#3399cc"
            },
            modal: {
                ondismiss: function() {
                    toast.error("Payment cancelled");
                    set({ isLoading: false });
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    },

    handlePaymentSuccess: async (response, userId) => {
        try {
            // Verify payment with backend
            const verifyRes = await axiosInstance.post("/subscription/verify-payment", {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                userId: userId
            });

            const result = verifyRes.data;

            if (result.success) {
                toast.success("Payment successful! Subscription activated.");
                // You might want to refresh user data or redirect here
                // window.location.reload(); // or navigate to dashboard
            } else {
                toast.error("Payment verification failed. Please contact support.");
            }

        } catch (error) {
            console.log("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
        } finally {
            set({ isLoading: false });
        }
    },

    // Optional: Get user's current subscription status
    getUserSubscription: async (userId) => {
        try {
            const res = await axiosInstance.get(`/subscription/status/${userId}`);
            return res.data;
        } catch (error) {
            console.log("getUserSubscription error:", error);
            return null;
        }
    }
}));
