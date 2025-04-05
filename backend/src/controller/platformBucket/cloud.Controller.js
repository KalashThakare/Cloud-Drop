import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../../lib/platformClient/s3.js";


export const Upload=async (req,res)=>{
    try {

        // const {bucketName} = req.body
        // console.log("req-body",req.body);
        // console.log("req-file",req.file);


        // if(!bucketName){
        //     return res.status(400).json({message:"Please connect to bucket"});
        // }

        const file = req.file

        if(!file){
            return res.status(400).json({message:"No file found"});
        }

        const s3Client = await getS3Client(platformS3);

        if (!s3Client) {
            return res.status(500).json({ message: "S3 Client not initialized. Please connect to the bucket again." });
        }
        
        const body=req.file.buffer;

        const params = {
            Bucket:process.env.BUCKET_NAME,
            Key:req.file.originalname,
            Body:body,
            ContentType:req.file.mimetype
        }

        const command = new PutObjectCommand(params);

        await s3Client.send(command);

        res.status(200).json({message:"File uploaded successfully"});
        console.log("Success");

        
        
    } catch (error) {
        res.status(500).json({message:"Error in upload controller"});
        console.log(error);
    }
}

export const generateSignedUrl =async(req,res)=>{

    try {

        const {fileName,expiration} = req.body;

        const bucketName = process.env.BUCKET_NAME;

        if(!bucketName){
            return res.status(400).json({message:"Please enter Bucket Name"});
        }

        const s3Client = await getS3Client(platformS3);

        if(!s3Client){
            return res.status(400).json({message:"S3 client not initialized"});
        }

        const Url = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket:bucketName,
                Key:fileName
            }),
            {expiresIn:`${expiration}`*60}
        )

        if(!Url){
            return res.status(400).json({message:"Error in generating Url"});
        }

        res.status(200).json({message:"Success",Url});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"error in getSignedUrl controller"});
    }

}