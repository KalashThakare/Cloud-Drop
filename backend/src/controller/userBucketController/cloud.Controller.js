import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../../lib/userClient/s3client.js";

export const uploadFileToS3 = async (req,res) => {

    const {bucketName,fileName} = req.body;

    if( !bucketName || !fileName){
        return res.status(404).json({message:"Unable to fetch the data"});
    }

    const  file = req.file;

    if(!file){
        return res.status(404).json({message:"file not found"});
    }

    const s3Client = await getS3Client(UserS3);

    const body=req.file.buffer;

    try {
        const params = {
            Bucket: bucketName,
            Key: req.file.originalname,
            Body: body,
            ContentType: req.file.mimetype
        };

        const command = new PutObjectCommand(params);
        
        await s3Client.send(command);
        
        res.status(200).json({message:"File uploaded successfully"});

        console.log("Success");


    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new Error("Failed to upload file");
    }
};

export const generateSignedUrl = async (req,res) => {

    try {

        const {fileName,expiration,bucketName} = req.body;

        if(!bucketName){
            return res.status(400).json({message:"Please enter Bucket Name"});
        }

        const s3Client = await getS3Client(UserS3);

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
};

