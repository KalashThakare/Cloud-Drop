import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errorUtils";

export const subscriptionStore = create((set, get) => ({
  selectedPlan: null,
  plans: [],
  isLoading: false,

  getPlans: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/subscription/plans");
      
      const plansData = res.data.plans || res.data;
      set({ plans: plansData });
      
      if (plansData.length > 0) {
        set({ selectedPlan: plansData[1]._id });
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404) {
        toast.warning(getErrorMessage(error, "No plans found"));
      } else {
        toast.error(getErrorMessage(error, "Failed to load plans"));
      }
      set({ plans: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  subscribeToPlan: async ({ userId, planId, router }) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/subscription/subscribe", {
        userId,
        planId,
      });
      const data = res.data;
      console.log(data)
      if (data.isFree) {
        toast.success("Subscribed to free plan successfully!");
        return;
      }
      if (data.subscriptionId) {
        get().initiateRazorpayPayment(
          data.subscriptionId,
          data.planDetails,
          userId,
          router,
        );
      }
    } catch (error) {
      const status = error?.response?.status;
      if (status === 400) {
        toast.warning(
          getErrorMessage(error, "Failed to initiate subscription")
        );
      } else {
        toast.error(
          getErrorMessage(
            error,
            "Failed to initiate subscription. Please try again."
          )
        );
      }
    } finally {
      set({ isLoading: false });
    }
  },

  initiateRazorpayPayment: (subscriptionId, planDetails, userId, router) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: subscriptionId,
      name: "CloudDrop",
      description: `Subscription to ${planDetails.name}`,
      image: "/logo.jpeg", 
      handler: function (response) {
        // Payment successful
        get().handlePaymentSuccess(response, userId, router);
      },
      prefill: {
        name: "User Name", // You can get this from user context/store
        email: "user@example.com", // You can get this from user context/store
        contact: "9999999999", // You can get this from user context/store
      },
      notes: {
        address: "Your Corporate Office",
      },
      theme: {
        color: "#00ACC1",
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled");
          set({ isLoading: false });
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  },

  handlePaymentSuccess: async (response, userId, router) => {
    try {
  
      const verifyRes = await axiosInstance.post(
        "/subscription/verify-payment",
        {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_subscription_id: response.razorpay_subscription_id,
          razorpay_signature: response.razorpay_signature,
          userId: userId,
        }
      );

      const result = verifyRes.data;

      if (result.success) {
        toast.success("Payment successful! Subscription activated.");
        router.push("/Main?useDefault=true");
  
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.log("Payment verification error:", error);
      const status = error?.response?.status;
      if (status === 400) {
        toast.warning(getErrorMessage(error, "Payment verification failed"));
      } else {
        toast.error(
          getErrorMessage(error, "Failed to verify payment. Please try again.")
        );
      }
      // toast.error("Payment verification failed. Please contact support.");
    } finally {
      set({ isLoading: false });
    }
  },

  getUserSubscription: async (userId) => {
    try {
      const res = await axiosInstance.get(`/subscription/status/${userId}`);
      return res.data;
    } catch (error) {
      console.log("getUserSubscription error:", error);
      const status = error?.response?.status;
      if (status === 404) {
        toast.warning(getErrorMessage(error, "No subscription found"));
      } else {
        toast.error(getErrorMessage(error, "Failed to fetch subscription status"));
      }
      return null;
    }
  },
}));