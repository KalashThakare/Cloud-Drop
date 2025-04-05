import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

let platformS3 = null

export const createS3Client = async (req, res) => {

    try {

        const bucket_Region = process.env.BUCKET_REGION;
        const key = process.env.accessKeyId;
        const secret = process.env.secretAccessKey;


        platformS3 = new S3Client({
            region: bucket_Region,
            credentials: {
                accessKeyId: key,
                secretAccessKey: secret
            }
        });

        res.status(200).json({ message: "S3 client created" });

    } catch (error) {

        res.status(500).json({error:"error in createS3Client"});
        console.log(error);

    }

};

export const getS3Client = () => {
    if (!platformS3) {
        throw new Error("S3 client has not been initialized yet.");
    }
    return platformS3;
};
