import Buckets from "../models/aws.Model.js";
import { S3Client } from "@aws-sdk/client-s3";
import { encrypt,decrypt } from "../lib/AES.js";

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
        

        const newBucket = new Bucket({
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

            const s3 = new S3Client({
                region:bucket.bucketRegion,
                credentials:{
                    accessKeyId:Key,
                    secretAccessKey:accessKey
                }
            })

            return res.status(200).json({message:"Bucket connected"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json("Error in Connect To Bucket",error.message);
    }
}