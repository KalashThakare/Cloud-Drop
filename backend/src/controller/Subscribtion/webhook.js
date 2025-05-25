import crypto from "crypto";
import User from "../../models/user.Model.js";
import dotenv from "dotenv";

dotenv.config();

export const razorpayWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers['x-razorpay-signature']; 

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(JSON.stringify(req.body)) 
            .digest('hex');

        if (signature !== expectedSignature) {
            return res.status(400).json({ message: "Invalid Signature" });
        }

        const event = req.body;
        const payload = event.payload;

        switch (event.event) {
            case 'subscription.completed':
            
                const subscriptionId = payload.subscription.entity.id;
                await User.findOneAndUpdate(
                    { 'subscription.razorpaySubId': subscriptionId },
                    {
                        'subscription.isActive': true,
                        'subscription.startedAt': new Date(),
                    }
                );
                break;

            case 'subscription.cancelled':
            case 'subscription.halted':
                
                const cancelledSubId = payload.subscription.entity.id;
                await User.findOneAndUpdate(
                    { 'subscription.razorpaySubId': cancelledSubId },
                    {
                        'subscription.isActive': false,
                        'subscription.endsAt': new Date(),
                    }
                );
                
                break;

            case 'payment.failed':
    
                console.log('Payment failed:', payload.payment.entity);
                break;

        }

        res.status(200).send('Webhook received');

    } catch (error) {
        console.log("Webhook error=>", error);
        res.status(500).send('Webhook processing failed');
    }
};