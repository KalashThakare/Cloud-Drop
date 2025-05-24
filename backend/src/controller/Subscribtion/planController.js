import SubscriptioModel from "../../models/subscriptionPlan.Model.js";
import razorpay from "../../lib/razorpay.js"
import User from "../../models/user.Model.js";

export const subscribeToPlan =async()=>{

    const {userId,planId} = req.body;

    const plan = await SubscriptioModel.findById(planId);

    if(!plan){
        return res.status(400).json({message:"No such plan found"});
    }

    if(plan.isFree){
        await User.findByIdAndUpdate(userId,{
            subscription:{
                isActive:true,
                plan:plan._id,
                endsAt:null,
            },
        })
        return res.status(200).json({message:"Subscribed to free plan"});
    }

    const subscription = await razorpay.subscriptions.create({
        plan_id:plan.razorpayPlanId,
        customer_notify:1,
        total_count:1,
    });

    await User.findByIdAndUpdate(userId,{
        subscription:{
            isActive:true,
            plan:plan._id,
            razorpaySubId:subscription.id
        }
    });

    res.status(200).json({message:"Subscription created",subscriptionId:subscription.id});

}