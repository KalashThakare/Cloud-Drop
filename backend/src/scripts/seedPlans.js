import dotenv from "dotenv";
import mongoose from "mongoose";
import SubscriptionModel from "../models/subscriptionPlan.Model.js";

dotenv.config();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const seed = async () => {
  await SubscriptionModel.create({
    name: "Pro",
    price: 341.89,
    razorpayPlanId: "plan_QabkP72GzeCBWr",
    features: [
    "Unlimited file uploads",
    "File expiration from 1 minute",
    "Unlimited group creation",
    "Unlimited signed URLs",
    "Send signed URLs via verified email",
    "Use /signedUrl command in group to share links"
  ],

    isFree: false,
  });

  console.log("Subscription plan seeded!");
  process.exit();
};

seed();
