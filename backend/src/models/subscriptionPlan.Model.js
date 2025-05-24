import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Free", "Pro"],
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  razorpayPlanId: {
    type: String,
    default: null, // Only needed for paid plans
  },
  features: {
    type: [String],
    default: [],
  },
  isFree: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const SubscriptionModel = new mongoose.model("SubscriptionPlan", subscriptionPlanSchema);

export default SubscriptionModel;
