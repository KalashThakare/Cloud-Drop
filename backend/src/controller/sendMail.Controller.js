import { generateVerificationToken,mailVerification } from "../services/verifyService.js";




export const reqAccess = async(req,res)=>{
    try {
        const {recipient,bucketName,expiration,fileName} = req.body;
        console.log(req.body)
        await generateVerificationToken(recipient,bucketName,expiration,fileName);

        res.status(200).json({message:"Verification links sent successfully!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Error in reAccess controller"});
    }
}

export const verifyEmail = async(req,res)=>{
    try {
        const {token} = req.query;
        console.log(token)
        const result = await mailVerification(req,token);

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