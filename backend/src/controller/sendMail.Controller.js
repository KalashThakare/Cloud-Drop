import { generateVerificationToken,mailVerification } from "../../services/verifyService.js";




export const reqAccess = async(req,res)=>{
    try {
        const {recipients,bucketName,expiration,fileName} = req.body;
        await generateVerificationToken(recipients,fileName,bucketName,expiration);

        res.status(200).json({message:"Verification links sent successfully!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Error in reAccess controller"});
    }
}

export const verifyEmail = async(req,res)=>{
    try {
        const {token} = req.query;
        const result = await mailVerification(token);

        if(result.success){
            res.status(200).json({message:"A secure link has been sent to your email"});
        }
        else{
            res.status(403).send("Invalid or expired link");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error processing verification");
    }
}