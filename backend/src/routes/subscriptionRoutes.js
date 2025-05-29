import express from "express";
import { 
    getPlans, 
    subscribeToPlan, 
    verifyPayment, 
    getSubscription, 
    checkLimits, 
    incrementUsage,
    cancelSubscription,
    getUsageStats,
    resetUsage,
    validateSignedUrlExpiration
} from "../controller/Subscribtion/unifiedController.js";
import { razorpayWebhook } from "../controller/Subscribtion/webhook.js";
import { checkSubscriptionLimits } from "../middleware/subscriptionLimits.js";

const router = express.Router();

router.get("/plans", getPlans);

router.post("/subscribe", subscribeToPlan);

router.post('/verify-payment', verifyPayment);

router.post("/cancel", cancelSubscription);

router.post("/current", getSubscription);

router.post("/usage-stats", getUsageStats);

router.post("/check-limits", checkSubscriptionLimits, checkLimits);

router.post("/increment-usage", checkSubscriptionLimits, incrementUsage);


router.post("/reset-usage", resetUsage);
router.post("/validate-signed-url-expiration", 
    checkSubscriptionLimits, 
    validateSignedUrlExpiration, 
    (req, res) => {
        res.status(200).json({ 
            success: true, 
            message: "Expiration time is valid",
            subscription: req.subscription.getUsageStats()
        });
    }
);

router.post('/webhook/razorpay', razorpayWebhook);

export default router;