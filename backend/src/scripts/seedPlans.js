import dotenv from "dotenv";
import mongoose from "mongoose";
import SubscriptionModel from "../models/subscriptionPlan.Model.js";

dotenv.config();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const seed = async () => {
  await SubscriptionModel.create({
    name: "Free",
    price: 0,
    razorpayPlanId: "", 
    isFree: true,
  });

  console.log("Subscription plan seeded!");
  process.exit();
};

seed();
