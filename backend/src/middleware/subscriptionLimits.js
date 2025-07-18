import Subscription from "../models/subscriptionHandler.Model.js";

// Helper function to create subscription (moved from controller)
const createSubscription = async (userId, plan = 'free') => {
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

export const checkSubscriptionLimits = async (req, res, next) => {
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
        
        if (!result.allowed) {
            return res.status(403).json({
                success: false,
                message: result.message,
                current: result.current,
                limit: result.limit,
                plan: subscription.plan
            });
        }
        
        // Attach subscription to request for use in next middleware
        req.subscription = subscription;
        next();
        
    } catch (error) {
        console.error('Error in subscription middleware:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error checking subscription limits" 
        });
    }
};