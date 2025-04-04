import { S3Client } from "@aws-sdk/client-s3";
import User from "../models/user.Model.js";

export const Creates3Client = async ({req,res, accessKeyId, secretAccessKey, sessionToken }) => {

    try {

        const s3 = new S3Client({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken: sessionToken
        })
    
        if (s3) {
    
            const user = await User.findById(req.user._id);
    
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
    
            const activeBucket = user.ConnectedBucket.push({
                buckName,
                accessKeyId,
                secretAccessKey,
                sessionToken
            });
    
            await user.save();

            res.status(200).json({messaage:"s3Client created successfully and saved to database"});
    
    
        }
        
    } catch (error) {

        res.status(500).json({error:"error in createS3Client"});
        console.log(error);
        
    }
    

}