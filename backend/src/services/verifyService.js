import {v4 as uuidv4} from "uuid";
import { sendUrl, sendVerificationEmail } from "../lib/nodeMailer.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../lib/platformClient/s3.js";

const verificationTokens = {};

export const generateVerificationToken=async(recipient,bucketName,expiration,filePath)=>{
    recipient.forEach((email) => {
        const token = uuidv4();
        const verificationLink = `http://localhost:4000/api/use-platform-bucket/sendMail/verify?token=${token}&bucketName=${bucketName}`

        verificationTokens[token]={email,filePath,bucketName,expiration};
        console.log("Saving Verification Token:", { email, bucketName, expiration, filePath });

        sendVerificationEmail(email,verificationLink);
    });
}

export const mailVerification=async(req,token)=>{
    if(!verificationTokens[token]){
        return {success:false};
    }

    const {email,bucketName,expiration,filePath}=verificationTokens[token];
    delete verificationTokens[token];

    try {
    
            const s3Client = await getS3Client(req);

            if (!s3Client) {
                console.error(`S3 Client not found for bucket: ${bucketName}`);
                return { success: false };
            }
    
            const Url = await getSignedUrl(
                s3Client,
                new GetObjectCommand({
                    Bucket:bucketName,
                    Key:filePath
                }),
                {expiresIn:`${expiration}`*60}
            )

            await sendUrl(email, Url, expiration);
    
            return {success:true};
            
        } catch (error) {
            console.error("Error generating signed URL:", error);
            return { success: false };
        }
}

