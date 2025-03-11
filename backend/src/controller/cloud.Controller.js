import s3 from "../lib/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";


export const Upload=async (req,res)=>{
    try {

        console.log("req-body",req.body);
        console.log("req-file",req.file);

        const file = req.file

        if(!file){
            return res.send(400).json({message:"No file found"});
        }
        
        const body=req.file.buffer;

        const params = {
            Bucket:process.env.BUCKET_NAME,
            Key:req.file.originalname,
            Body:body,
            ContentType:req.file.mimetype
        }

        const command = new PutObjectCommand(params);

        await s3.send(command);

        res.status(200).json({message:"File uploaded successfully"});
        console.log("Success");

        
        
    } catch (error) {
        res.status(500).json({message:"Error in upload controller"});
        console.log(error);
    }
}