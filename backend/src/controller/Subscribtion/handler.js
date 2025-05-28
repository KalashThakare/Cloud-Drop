import Subscription from "../../models/subscriptionHandler.Model.js";
import User from "../../models/user.Model.js";

// Create subscription for new user (called during signup)
export const createSubscription = async (userId, plan = 'free') => {
    try {
        const subscription = new Subscription({
            userId,
            plan,
            status: 'active'
        });
        
        await subscription.save();
        return subscription;
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
};

// Get user's current subscription
export const getSubscription = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }
        
        let subscription = await Subscription.findOne({ userId });
        
        // Create subscription if it doesn't exist
        if (!subscription) {
            subscription = await createSubscription(userId);
        }
        
        // Reset usage counters if needed
        await subscription.resetUsageIfNeeded();
        
        const usageStats = subscription.getUsageStats();
        
        res.status(200).json({
            success: true,
            subscription: usageStats
        });
        
    } catch (error) {
        console.error('Error getting subscription:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching subscription data" 
        });
    }
};

export const upgradeToPro = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }
        
        let subscription = await Subscription.findOne({ userId });
        
        if (!subscription) {
            subscription = await createSubscription(userId, 'pro');
        } else {
            subscription.plan = 'pro';
            subscription.status = 'active';
            await subscription.save();
        }
        
        res.status(200).json({
            success: true,
            message: "Successfully upgraded to Pro plan",
            subscription: subscription.getUsageStats()
        });
        
    } catch (error) {
        console.error('Error upgrading to pro:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error upgrading subscription" 
        });
    }
};

export const downgradeToFree = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }
        
        let subscription = await Subscription.findOne({ userId });
        
        if (!subscription) {
            subscription = await createSubscription(userId);
        } else {
            subscription.plan = 'free';
            subscription.status = 'active';
            await subscription.save();
        }
        
        res.status(200).json({
            success: true,
            message: "Successfully downgraded to Free plan",
            subscription: subscription.getUsageStats()
        });
        
    } catch (error) {
        console.error('Error downgrading to free:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error downgrading subscription" 
        });
    }
};

export const checkLimits = async (req, res) => {
    try {
        const { userId, action } = req.body;
        
        if (!userId || !action) {
            return res.status(400).json({
                success: false,
                message: "userId and action are required"
            });
        }
        
        let subscription = await Subscription.findOne({ userId });
        
        if (!subscription) {
            subscription = await createSubscription(userId);
        }
        
        await subscription.resetUsageIfNeeded();
        
        const result = subscription.canPerformAction(action);
        
        res.status(200).json({
            success: true,
            ...result
        });
        
    } catch (error) {
        console.error('Error checking limits:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error checking subscription limits" 
        });
    }
};

export const incrementUsage = async (req, res) => {
    try {
        const { userId, action } = req.body;
        
        if (!userId || !action) {
            return res.status(400).json({
                success: false,
                message: "userId and action are required"
            });
        }
        
        let subscription = await Subscription.findOne({ userId });
        
        if (!subscription) {
            subscription = await createSubscription(userId);
        }
        
        const canPerform = subscription.canPerformAction(action);
        
        if (!canPerform.allowed) {
            return res.status(403).json({
                success: false,
                message: canPerform.message,
                current: canPerform.current,
                limit: canPerform.limit
            });
        }
        
        await subscription.incrementUsage(action);
        
        res.status(200).json({
            success: true,
            message: `${action} usage incremented successfully`,
            subscription: subscription.getUsageStats()
        });
        
    } catch (error) {
        console.error('Error incrementing usage:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error updating usage statistics" 
        });
    }
};

export const getUsageStats = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }
        
        let subscription = await Subscription.findOne({ userId });
        
        if (!subscription) {
            subscription = await createSubscription(userId);
        }
        
        await subscription.resetUsageIfNeeded();
        
        const stats = subscription.getUsageStats();
        
        res.status(200).json({
            success: true,
            stats
        });
        
    } catch (error) {
        console.error('Error getting usage stats:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching usage statistics" 
        });
    }
};

export const resetUsage = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }
        
        let subscription = await Subscription.findOne({ userId });
        
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: "Subscription not found"
            });
        }
        
        subscription.filesUploaded = 0;
        subscription.signedUrlsGenerated = 0;
        subscription.groupsCreated = 0;
        subscription.lastResetDate = new Date();
        
        await subscription.save();
        
        res.status(200).json({
            success: true,
            message: "Usage statistics reset successfully",
            subscription: subscription.getUsageStats()
        });
        
    } catch (error) {
        console.error('Error resetting usage:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error resetting usage statistics" 
        });
    }
};

// Sync subscription with Razorpay payment (to be called after successful payment)
export const syncSubscriptionWithPayment = async (userId, planType) => {
    try {
        let subscription = await Subscription.findOne({ userId });
        
        if (!subscription) {
            subscription = await createSubscription(userId, planType);
        } else {
            subscription.plan = planType;
            subscription.status = 'active';
            await subscription.save();
        }
        
        return subscription;
        
    } catch (error) {
        console.error('Error syncing subscription with payment:', error);
        throw error;
    }
};

// Get signed URL with expiration limits for free users
export const validateSignedUrlExpiration = async (req, res, next) => {
    try {
        const { userId, expirationHours } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }
        
        let subscription = await Subscription.findOne({ userId });
        
        if (!subscription) {
            subscription = await createSubscription(userId);
        }
        
        // For free users, minimum expiration is 24 hours
        if (subscription.plan === 'free' && expirationHours < 24) {
            return res.status(403).json({
                success: false,
                message: "Free plan users must set expiration time to at least 24 hours",
                minimumHours: 24,
                currentPlan: subscription.plan
            });
        }
        
        req.subscription = subscription;
        next();
        
    } catch (error) {
        console.error('Error validating signed URL expiration:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error validating expiration time" 
        });
    }
};