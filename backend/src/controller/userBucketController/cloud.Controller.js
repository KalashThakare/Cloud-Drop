import assumeRole from "../../lib/assumeRole.js";
import { createS3Client } from "../../lib/s3.js";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadFileToS3 = async (req,res) => {

    const {roleArn,bucketName,fileName} = req.body;

    if(!roleArn || !bucketName || !fileName){
        return res.status(404).json({message:"Unable to fetch the data"});
    }

    const  file = req.file;

    if(!file){
        return res.status(404).json({message:"file not found"});
    }

    const tempCreds = await assumeRole(roleArn);

    const s3Client = await createS3Client(tempCreds.accessKeyId,tempCreds.secretAccessKey,tempCreds.sessionToken);

    if(!s3Client){
        return res.status(404).json({message:"S3 client creation error"});
    }

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

    const {roleArn,bucketName,fileName,expiresIn} = req.body;


    const tempCreds = await assumeRole(roleArn);

    const s3 = new AWS.S3({
        accessKeyId: tempCreds.accessKeyId,
        secretAccessKey: tempCreds.secretAccessKey,
        sessionToken: tempCreds.sessionToken
    });

    try {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Expires: expiresIn,  // URL expiration in seconds
        };

        const signedUrl = await s3.getSignedUrlPromise("getObject", params);
        return signedUrl;
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw new Error("Failed to generate signed URL");
    }
};

