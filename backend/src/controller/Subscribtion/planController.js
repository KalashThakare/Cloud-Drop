import SubscriptioModel from "../../models/subscriptionPlan.Model.js";
import razorpay from "../../lib/razorpay.js"
import User from "../../models/user.Model.js";
import crypto from "crypto";

export const subscribeToPlan = async (req, res) => {

    const { userId, planId } = req.body;

    const plan = await SubscriptioModel.findById(planId);

    if (!plan) {
        return res.status(400).json({ message: "No such plan found" });
    }

    if (plan.isFree) {
        await User.findByIdAndUpdate(userId, {
            subscription: {
                isActive: true,
                plan: plan._id,
                endsAt: null,
            },
        })
        return res.status(200).json({ message: "Subscribed to free plan" });
    }

    const subscription = await razorpay.subscriptions.create({
        plan_id: plan.razorpayPlanId,
        customer_notify: 1,
        total_count: 1,
    });

    res.status(200).json({
            message: "Subscription created, proceed to payment",
            subscriptionId: subscription.id,
            planDetails: {
                name: plan.name,
                amount: plan.price
            },
            isFree: false
        });

}


export const getPlans = async (req, res) => {
    try {

        const plans = await SubscriptioModel.find();
        return res.status(200).json(plans);

    } catch (error) {
        console.log("getPlans error=>", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

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

        const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);

        const plan = await SubscriptioModel.findOne({
            razorpayPlanId: subscription.plan_id
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

        res.status(200).json({
            success: true,
            message: "Payment verified and subscription activated"
        });

    } catch (error) {

        console.log("verifyPayment error=>", error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });

    }

}