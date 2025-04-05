import { S3 } from "aws-sdk";

let UserS3=null;

export const Creates3Client = async ({req,res, accessKeyId, secretAccessKey, sessionToken }) => {

    try {

        UserS3 = new S3({
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
            sessionToken: sessionToken
        });

        res.status(200).json({message:" client created Succesfully"});
        
    } catch (error) {

        res.status(500).json({error:"error in createS3Client"});
        console.log(error);
        
    }
    
}

export const getS3Client = () => {
    if (!UserS3) {
        throw new Error("S3 client has not been initialized yet.");
    }
    return UserS3;
};