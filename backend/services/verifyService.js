import {v4 as uuidv4} from "uuid";
import { sendVerificationEmail } from "../src/lib/nodeMailer.js";

const verificationTokens = {};

export const generateVerificationToken=async(recipients,bucketName,expiration,fileName)=>{
    recipients.forEach((email) => {
        const token = uuidv4();
        const verificationLink = `http://localhost:4000/api/func/verify?token=${token}`

        verificationTokens[token]={email,bucketName,expiration,fileName};

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
    
            const s3Client = req.app.locals.s3Clients?.[bucketName];
    
            const Url = await getSignedUrl(
                s3Client,
                new GetObjectCommand({
                    Bucket:bucketName,
                    Key:fileName
                }),
                {expiresIn:`${expiration}`*60}
            )

            await sendSignedUrl(email, Url);
    
            return {success:true};
            
        } catch (error) {
            console.error("Error generating signed URL:", error);
            return { success: false };
        }
}

