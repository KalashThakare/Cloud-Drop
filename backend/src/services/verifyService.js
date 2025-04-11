import {v4 as uuidv4} from "uuid";
import { sendUrl, sendVerificationEmail } from "../lib/nodeMailer.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../lib/platformClient/s3.js";

const verificationTokens = {};

export const generateVerificationToken=async(recipient,bucketName,expiration,fileName)=>{
    recipient.forEach((email) => {
        const token = uuidv4();
        const verificationLink = `http://localhost:4000/api/use-platform-bucket/sendMail/verify?token=${token}&bucketName=${bucketName}`

        verificationTokens[token]={email,fileName,bucketName,expiration};
        console.log("Saving Verification Token:", { email, bucketName, expiration, fileName });

        sendVerificationEmail(email,verificationLink);
    });
}

export const mailVerification=async(req,token)=>{
    if(!verificationTokens[token]){
        return {success:false};
    }

    const {email,bucketName,expiration,fileName}=verificationTokens[token];
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
                    Key:fileName
                }),
                {expiresIn:`${expiration}`*60}
            )

            await sendUrl(email, Url);
    
            return {success:true};
            
        } catch (error) {
            console.error("Error generating signed URL:", error);
            return { success: false };
        }
}

