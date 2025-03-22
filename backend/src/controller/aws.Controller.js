import User from "../models/user.Model.js";
import { encrypt,decrypt } from "../lib/AES.js";
import { createS3Client } from "../lib/s3.js";
import bcrypt from "bcrypt";
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

export const awsConfig= async(req,res)=>{
    const {bucketName,bucketRegion,bucketKey,bucketSecret,secret} = req.body; 
    try {

        if(!bucketKey || !bucketName || !bucketRegion || !bucketSecret || !secret){
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

        const salt = await bcrypt.genSalt(11);

        const hashedSecret = await bcrypt.hash(secret,salt);
        const encryptedKey = encrypt(bucketKey,hashedSecret); 
        const encryptedAccesssKey = encrypt(bucketSecret,hashedSecret);
        

        const newBucket = user.buckets.push({
            bucketName,
            bucketRegion,
            bucketKey:encryptedKey,
            bucketSecret:encryptedAccesssKey,
            secret:hashedSecret
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

    const {bucketName,secret} = req.body;

    try {

        if(!secret){
            return res.status(400).json({message:"Please enter secret"});
        }

        if(!bucketName){
            return res.status(400).json({message:"Please enter bucket name"});
        }

        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(400).json({message:"Unauthorised"});
        }

        const bucket = await user.buckets.find(bucket=>bucket.bucketName==bucketName);

        if (!bucket) {
            return res.status(400).json({ message: "Bucket not found" });
        }

        const compareSecret = await bcrypt.compare(secret,bucket.secret);

        if(bucket && compareSecret){
            const Key = decrypt(bucket.bucketKey,bucket.secret);
            const accessKey = decrypt(bucket.bucketSecret,bucket.secret);
            const bucket_Region = bucket.bucketRegion;

            const s3Client = createS3Client({ Key, accessKey, bucket_Region });

            req.app.locals.s3Clients = req.app.locals.s3Clients || {};
            req.app.locals.s3Clients[bucketName] = s3Client;

            req.app.locals.connectedBucket = bucketName;

            const filesResponse = await fetchFilesFromS3(s3Client, bucketName);

            if(filesResponse=='AccessDenied'){
                return res.status(400).json({message:"Please update your policies"});
            };

            return res.status(200).json({message:"Bucket connected",bucketName});
        }else{
            return res.status(400).json({message:"Error connecting bucket"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error in Connect To Bucket", message: error.message });

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

        return res.status(200).json({message:"Bucket deleted successfully"});

    } catch (error) {
        console.log("Error deleting bucket",error);
        res.status(500).json({message:"error in deleteBucket controller"});
    }
}

const fetchFilesFromS3 = async (s3Client, bucketName) => {
    try {
        const command = new ListObjectsV2Command({ Bucket: bucketName });
        const data = await s3Client.send(command);

        return { success: true, files: data.Contents || [] };
    } catch (error) {
        console.error("Error fetching files:", error);
        return { success: false, message: error.message };
    }
};