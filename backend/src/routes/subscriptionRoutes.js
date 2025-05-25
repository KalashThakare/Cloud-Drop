import express from "express";
import { subscribeToPlan, getPlans, verifyPayment } from "../controller/Subscribtion/planController.js";
import { razorpayWebhook } from "../controller/Subscribtion/webhook.js";


const router = express.Router();

router.post("/subscribe",subscribeToPlan);

router.get("/plans",getPlans);

router.post('/verify-payment', verifyPayment);

router.post('/webhook/razorpay', razorpayWebhook);

export default router;
