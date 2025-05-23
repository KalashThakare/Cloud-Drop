import crypto from "crypto";
import User from "../../models/user.Model.js";
import dotenv from "dotenv";

dotenv.config();

export const razorpayWebhook =async() =>{
    
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = requestAnimationFrame.headers['x-razorpay-signature'];

    const expectedSignature = crypto.createHmac('sha256',secret)
    .update(req.body.toString())
    .digest('hex');

    if(signature !== expectedSignature){
        return res.status(400).send({message:"Invalid Signature"});
    }

    const event = JSON.parse(req.body);
    const payload = event.payload;

    switch(event.event){
        case'subscription.complete':
        case'supscription.cancelled':

        const subscriptionId = payload.subscription.entity.id;

        await User.findOneAndUpdate(
            {'subscription.razorpaySubId':subscriptionId},
            {
                'subscription.isActive':false,
                'subscription.endsAt':new Date(),
            }
        );
        break;

    };

    res.status(200).send('webhook recieved');

}