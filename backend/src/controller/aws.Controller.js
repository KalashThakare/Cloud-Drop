import bcrypt from "bcrypt";
import Bucket from "../models/aws.Model.js";

export const awsConfig= async(req,res)=>{
    const {bucketName,bucketRegion,bucketKey,bucketSecret} = req.body; 
    try {

        if(!bucketKey || !bucketName || !bucketRegion || !bucketSecret){
            return res.status(400).json({message:"All fields are necessary"});
        }

        const existingBucket = await Bucket.findOne({bucketName});

        if(existingBucket){
            return res.status(400).json({message:"Bucket alredy exist"});
        }

        const salt = await bcrypt.genSalt(11);
        const hashedSecret = await bcrypt.hash(bucketSecret, salt);
        const hashedKey = await bcrypt.hash(bucketKey, salt);

        const newBucket = new Bucket({
            bucketName,
            bucketRegion,
            bucketKey:hashedKey,
            bucketSecret:hashedSecret,
        })

        if(newBucket){

            await newBucket.save();

            res.status(200).json({
                bucketName:newBucket.bucketName,
                bucketRegion:newBucket.bucketRegion,
            });
        }else{
            return res.status(400).json({message:"Error in awsConfig controller"});
        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error"});
    }
}