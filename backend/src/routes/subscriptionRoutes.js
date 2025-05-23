import express from "express";
import { subscribeToPlan } from "../controller/Subscribtion/planController.js";
import { razorpayWebhook } from "../controller/Subscribtion/webhook.js";


const router = express.Router();

router.post("/subscribe",subscribeToPlan);

router.post('/webhook/razorpay', express.raw({ type: 'application/json' }), razorpayWebhook);

export default router;
