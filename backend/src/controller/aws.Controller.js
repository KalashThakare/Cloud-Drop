import { S3Client } from "@aws-sdk/client-s3";

export const awsConfig=(req,res)=>{
    const {bucketName,bucketRegion,bucketKey,bucketSecret} = req.body; 
    try {

        if(!bucketKey || !bucketName || !bucketRegion || !bucketSecret){
            return res.status(400).json({message:"All fields are necessary"});
        }

        


        
    } catch (error) {
        
    }
}