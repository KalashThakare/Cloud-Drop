import { S3Client } from "@aws-sdk/client-s3";
import config from "../models/user.Model.js";
import bcrypt from "bcrypt";

export const awsConfig= async(req,res)=>{
    const {bucketName,bucketRegion,bucketKey,bucketSecret} = req.body; 
    try {

        if(!bucketKey || !bucketName || !bucketRegion || !bucketSecret){
            return res.status(400).json({message:"All fields are necessary"});
        }

        const bucket = await config.findOne({bucketName});

        if(bucket){
            return res.status(400).json({message:"Bucket alredy exist"});
        }

        const salt = await bcrypt.genSalt(11);
        const hashedRegion = await bcrypt.hash(bucketRegion, salt);
        const hashedSecret = await bcrypt.hash(bucketSecret, salt);
        const hashedKey = await bcrypt.hash(bucketKey, salt);

        const newBucket = {
            bucketName,
            bucketRegion:hashedRegion,
            bucketKey:hashedKey,
            bucketSecret:hashedSecret
        }

        if(newBucket){
            await newBucket.save();

            res.status(200).json({
                bucketName:newBucket.bucketName,
                bucketRegion:newBucket.bucketRegion,
                bucketKey:newBucket.bucketKey,
                bucketSecret:newBucket.bucketSecret
            });
        }else{
            return res.status(400).json({message:"Error in awsConfig controller"});
        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Error"});
    }
}