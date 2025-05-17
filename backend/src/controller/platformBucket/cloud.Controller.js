import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../../lib/platformClient/s3.js";
import dotenv from "dotenv";

dotenv.config();


export const Upload=async (req,res)=>{
    try {

        const s3Client = await getS3Client(req);

        console.log("req-body",req.body);
        console.log("req-file",req.files);

        const {bucketName} = req.body;
        // if(!bucketName){
        //     return res.status(400).json({message:"Please connect to bucket"});
        // }

        const files = req.files

        console.log(files)

        if(!files || files.length === 0){
            return res.status(400).json({message:"No file found"});
        }

        const uploadResults = [];
        

        for (const file of files) {
            const params = {
                Bucket: bucketName,
                Key: file.originalname,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            

            const command = new PutObjectCommand(params);
            await s3Client.send(command);
            uploadResults.push({ filename: file.originalname, status: "uploaded" });
        };

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

        const s3Client = await getS3Client(req);

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