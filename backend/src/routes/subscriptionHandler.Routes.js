import express from "express";
import { 
    getSubscription, 
    upgradeToPro, 
    downgradeToFree, 
    checkLimits, 
    incrementUsage, 
    getUsageStats, 
    resetUsage,
    validateSignedUrlExpiration
} from "../controller/Subscribtion/handler.js";
import { checkSubscriptionLimits } from "../middleware/subscriptionLimits.js";

const router = express.Router();

router.post("/get-subscription", getSubscription);

router.post("/usage-stats", getUsageStats);

router.post("/check-limits", checkSubscriptionLimits, checkLimits);

router.post("/increment-usage",checkSubscriptionLimits, incrementUsage);

router.post("/upgrade-to-pro", upgradeToPro);

router.post("/downgrade-to-free", downgradeToFree);

router.post("/reset-usage", resetUsage);

router.post("/validate-signed-url-expiration",checkSubscriptionLimits, validateSignedUrlExpiration, (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "Expiration time is valid",
        subscription: req.subscription.getUsageStats()
    });
});

export default router;