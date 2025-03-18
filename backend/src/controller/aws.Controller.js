import User from "../models/user.Model.js";
import { encrypt,decrypt } from "../lib/AES.js";
import { createS3Client } from "../lib/s3.js";

export const awsConfig= async(req,res)=>{
    const {bucketName,bucketRegion,bucketKey,bucketSecret} = req.body; 
    try {

        if(!bucketKey || !bucketName || !bucketRegion || !bucketSecret){
            return res.status(400).json({message:"All fields are necessary"});
        }

        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"User not found"});
        }

        const existingBucket = await user.buckets.find(bucket=>bucket.bucketName==bucketName);

        if(existingBucket){
            return res.status(400).json({message:"Bucket alredy exist"});
        }

        const secret = process.env.SECRET_TEXT;
        const encryptedKey = encrypt(bucketKey,secret); 
        const encryptedAccesssKey = encrypt(bucketSecret,secret);
        

        const newBucket = user.buckets.push({
            bucketName,
            bucketRegion,
            bucketKey:encryptedKey,
            bucketSecret:encryptedAccesssKey,
        })

        await user.save();

        const addedBucket = user.buckets[user.buckets.length - 1];

        res.status(200).json({
            bucketName: addedBucket.bucketName,
            bucketRegion: addedBucket.bucketRegion,
        });

        
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

        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"Unauthorised"});
        }

        const bucket = await user.buckets.find(bucket=>bucket.bucketName==bucketName);

        if(bucket){
            const Key = decrypt(bucket.bucketKey,secret);
            const accessKey = decrypt(bucket.bucketSecret,secret);
            const bucket_Region = bucket.bucketRegion;

            const s3Client = createS3Client({ Key, accessKey, bucket_Region });

            req.app.locals.s3Clients = req.app.locals.s3Clients || {};
            req.app.locals.s3Clients[bucketName] = s3Client;

            return res.status(200).json({message:"Bucket connected",bucketName});
        }else{
            return res.status(400).json({message:"Error connecting bucket"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json("Error in Connect To Bucket",error.message);
    }
}

export const fetchBucket=async(req,res)=>{
    try {

        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"user not found"});
        }

        const buckets = user.buckets;

        if (!buckets || buckets.length === 0) {
            return res.status(200).json({ message: "No buckets found. Please add a bucket." });
        }

        return res.status(200).json({message:"success",buckets});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Error in fetching buckets"});
    }
}

export const deleteBucket = async(req,res)=>{
    try {
        const {bucketName} = req.body;

        if(!bucketName){
            res.status(400).json({message:"Please select bucket"});
        }

        const user = await User.findById(req.user._id)

        const bucket = await user.buckets.find(bucket=>bucket.bucketName==bucketName);

        if(!bucket){
            res.status(400).json({message:"BUcket not founnd"});
        }

        user.buckets = user.buckets.filter(bucket => bucket.bucketName !== bucketName);

        await user.save();

        return res.status(200).json({message:"Buclet deleted successfully"});

    } catch (error) {
        console.log("Error deleting bucket",error);
        res.status(500).json({message:"error in deleteBucket controller"});
    }
}