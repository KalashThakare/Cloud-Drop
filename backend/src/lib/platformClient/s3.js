import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();


export const createS3Client = async (req, res) => {

    try {
        const bucketName = process.env.BUCKET_NAME;

        const bucket_Region = process.env.BUCKET_REGION;
        const key = process.env.IAM_ACCESS_KEY;
        const secret = process.env.IAM_SECRET_KEY;


        const platformS3 = new S3Client({
            region: bucket_Region,
            credentials: {
                accessKeyId: key,
                secretAccessKey: secret
            }
        });

        req.app.locals.platformS3 = platformS3;

        res.status(200).json({ message: "S3 client created" , bucketName:bucketName});

    } catch (error) {

        res.status(500).json({error:"error in createS3Client"});
        console.log(error);

    }

};

export const getS3Client = (req,res) => {
    const s3 = req.app.locals.platformS3;
    if (!s3) {
        throw new Error("S3 client has not been initialized yet.");
    }
    return s3;
};
