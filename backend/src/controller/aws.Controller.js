import Buckets from "../models/aws.Model.js";
import { encrypt,decrypt } from "../lib/AES.js";
import { createS3Client, s3 } from "../lib/s3.js";

export const awsConfig= async(req,res)=>{
    const {bucketName,bucketRegion,bucketKey,bucketSecret} = req.body; 
    try {

        if(!bucketKey || !bucketName || !bucketRegion || !bucketSecret){
            return res.status(400).json({message:"All fields are necessary"});
        }

        const existingBucket = await Buckets.findOne({bucketName});

        if(existingBucket){
            return res.status(400).json({message:"Bucket alredy exist"});
        }

        const secret = process.env.SECRET_TEXT;
        const encryptedKey = encrypt(bucketKey,secret); 
        const encryptedAccesssKey = encrypt(bucketSecret,secret);
        

        const newBucket = new Buckets({
            bucketName,
            bucketRegion,
            bucketKey:encryptedKey,
            bucketSecret:encryptedAccesssKey,
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

export const connectToBucket =async(req,res)=>{

    try {

        const {bucketName} = req.body;

        const secret = process.env.SECRET_TEXT;

        if(!bucketName){
            return res.status(400).json({message:"Please enter bucket name"});
        }

        const bucket = await Buckets.findOne({bucketName});

        if(bucket){
            const Key = decrypt(bucket.bucketKey,secret);
            const accessKey = decrypt(bucket.bucketSecret,secret);
            const bucket_Region = bucket.bucketRegion;

            req.s3 = createS3Client({Key,accessKey,bucket_Region});

            return res.status(200).json({message:"Bucket connected",bucketName});
        }else{
            return res.status(400).json({message:"Error connecting bucket"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json("Error in Connect To Bucket",error.message);
    }
}