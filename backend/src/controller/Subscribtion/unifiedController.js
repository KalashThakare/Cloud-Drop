import SubscriptionPlanModel from "../../models/subscriptionPlan.Model.js";
import Subscription from "../../models/subscriptionHandler.Model.js";
import User from "../../models/user.Model.js";
import razorpay from "../../lib/razorpay.js";
import crypto from "crypto";

export const getPlans = async (req, res) => {
    try {
        const plans = await SubscriptionPlanModel.find();
        return res.status(200).json({
            success: true,
            plans
        });
    } catch (error) {
        console.log("getPlans error=>", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};

export const subscribeToPlan = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        if (!userId || !planId) {
            return res.status(400).json({
                success: false,
                // message: "userId and planId are required"
                message: "Please Login to Subscribe"
            });
        }

        const plan = await SubscriptionPlanModel.findById(planId);
        if (!plan) {
            return res.status(400).json({ 
                success: false,
                message: "No such plan found" 
            });
        }

        // Handle free plan
        if (plan.isFree) {
            // Update user's subscription in User model
            await User.findByIdAndUpdate(userId, {
                subscription: {
                    isActive: true,
                    plan: plan._id,
                    endsAt: null,
                },
            });

            // Create or update subscription in handler model
            let subscription = await Subscription.findOne({ userId });
            if (!subscription) {
                subscription = new Subscription({
                    userId,
                    plan: 'free',
                    status: 'active'
                });
            } else {
                subscription.plan = 'free';
                subscription.status = 'active';
            }
            await subscription.save();

            return res.status(200).json({ 
                success: true,
                message: "Subscribed to free plan",
                subscription: subscription.getUsageStats()
            });
        }

        // Handle paid plan - create Razorpay subscription
        const razorpaySubscription = await razorpay.subscriptions.create({
            plan_id: plan.razorpayPlanId,
            customer_notify: 1,
            total_count: 1,
        });

        res.status(200).json({
            success: true,
            message: "Subscription created, proceed to payment",
            subscriptionId: razorpaySubscription.id,
            planDetails: {
                name: plan.name,
                amount: plan.price
            },
            isFree: false
        });

    } catch (error) {
        console.log("subscribeToPlan error=>", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature,
            userId
        } = req.body;

        const body = razorpay_payment_id + "|" + razorpay_subscription_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        const razorpaySubscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);
        
        const plan = await SubscriptionPlanModel.findOne({
            razorpayPlanId: razorpaySubscription.plan_id
        });

        if (!plan) {
            return res.status(400).json({
                success: false,
                message: "Plan not found"
            });
        }

        await User.findByIdAndUpdate(userId, {
            subscription: {
                isActive: true,
                plan: plan._id,
                razorpaySubId: razorpay_subscription_id,
                startedAt: new Date(),
                endsAt: new Date(Date.now() + (plan.duration * 24 * 60 * 60 * 1000))
            }
        });

        let subscription = await Subscription.findOne({ userId });
        if (!subscription) {
            subscription = new Subscription({
                userId,
                plan: 'pro',
                status: 'active',
                razorpaySubscriptionId: razorpay_subscription_id
            });
        } else {
            subscription.plan = 'pro';
            subscription.status = 'active';
            subscription.razorpaySubscriptionId = razorpay_subscription_id;
        }
        await subscription.save();

        res.status(200).json({
            success: true,
            message: "Payment verified and subscription activated",
            subscription: subscription.getUsageStats()
        });

    } catch (error) {
        console.log("verifyPayment error=>", error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};

export const getSubscription = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const user = await User.findById(userId).populate('subscription.plan');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let subscription = await Subscription.findOne({ userId });
        if (!subscription) {
            const planType = user.subscription?.isActive && user.subscription.plan ? 
                (user.subscription.plan.isFree ? 'free' : 'pro') : 'free';
            subscription = await createSubscription(userId, planType);
        }

        await subscription.resetUsageIfNeeded();

        if (user.subscription?.endsAt && new Date() > user.subscription.endsAt) {
            await User.findByIdAndUpdate(userId, {
                'subscription.isActive': false
            });
            subscription.plan = 'free';
            subscription.status = 'active';
            await subscription.save();
        }

        const usageStats = subscription.getUsageStats();
        
        res.status(200).json({
            success: true,
            subscription: {
                ...usageStats,
                planDetails: user.subscription?.plan || null,
                isActive: user.subscription?.isActive || false,
                endsAt: user.subscription?.endsAt || null
            }
        });
        
    } catch (error) {
        console.error('Error getting subscription:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching subscription data" 
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

        const user = await User.findById(userId);
        if (user.subscription?.endsAt && new Date() > user.subscription.endsAt) {
            await User.findByIdAndUpdate(userId, {
                'subscription.isActive': false
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

export const cancelSubscription = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const user = await User.findById(userId);
        if (!user || !user.subscription?.razorpaySubId) {
            return res.status(400).json({
                success: false,
                message: "No active subscription found"
            });
        }

        await razorpay.subscriptions.cancel(user.subscription.razorpaySubId);

        await User.findByIdAndUpdate(userId, {
            'subscription.isActive': false,
            'subscription.razorpaySubId': null
        });

        let subscription = await Subscription.findOne({ userId });
        if (subscription) {
            subscription.plan = 'free';
            subscription.status = 'active';
            await subscription.save();
        }

        res.status(200).json({
            success: true,
            message: "Subscription cancelled successfully"
        });

    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({
            success: false,
            message: "Error cancelling subscription"
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

// Validate signed URL expiration for free users
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