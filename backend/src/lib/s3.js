import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.IAM_ACCESS_KEY
const secretKey = process.env.IAM_SECRET_KEY

console.log(bucketName);

const s3 = new S3Client({
    region:bucketRegion,
    credentials:{
        accessKeyId:accessKey,
        secretAccessKey:secretKey
    }
});

export default s3;