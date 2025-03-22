import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


export const Upload=async (req,res)=>{
    try {

        const {bucketName} = req.body
        console.log("req-body",req.body);
        console.log("req-file",req.file);


        if(!bucketName){
            return res.status(400).json({message:"Please connect to bucket"});
        }

        const file = req.file

        if(!file){
            return res.status(400).json({message:"No file found"});
        }

        const s3Client = req.app.locals.s3Clients?.[bucketName];

        if (!s3Client) {
            return res.status(500).json({ message: "S3 Client not initialized. Please connect to the bucket again." });
        }
        
        const body=req.file.buffer;

        const params = {
            Bucket:bucketName,
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

        const bucketName = req.app.locals.connectedBucket

        const {fileName,expiration} = req.body;

        if(!bucketName){
            return res.status(400).json({message:"Please enter Bucket Name"});
        }

        const s3Client = req.app.locals.s3Clients?.[bucketName];

        if(!s3Client){
            return res.status(400).json({message:"S3 client not initialized"});
        }

        const Url = await getSignedUrl(
            s3Client,
            GetObjectCommand({
                Bucket:bucketName,
                Key:fileName
            }),
            {expiresIn:`${expiration}`*60}
        )

        if(!Url){
            return res.status(400).json({message:"Error in generating Url"});
        }

        res.status(200).json({message:"Success"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"error in getSignedUrl controller"});
    }

}