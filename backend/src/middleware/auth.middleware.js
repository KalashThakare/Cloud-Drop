import jwt from "jsonwebtoken";
import User from "../models/user.Model.js";
import dotenv from "dotenv";
dotenv.config();

export const protectRoute =async (req,res,next)=>{
    try {

        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({messagge:"Unauthorised -No token provided"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({messagge:"Unauthorised"});
        }

        const user = await User.findById(decoded._id).select("-password");

        if(!user){
            return res.status(401).json({message:"user not found"});
        }

        req.user=user

        next();
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"Error in auth Middleware"})
    }
}

export const attachS3Client = (req, res, next) => {
    const { bucketName } = req.body;

    if (!bucketName) {
        return res.status(400).json({ message: "Please connect to a bucket first." });
    }

    if (!req.app.locals.s3Clients || !req.app.locals.s3Clients[bucketName]) {
        return res.status(400).json({ message: "Bucket not connected." });
    }

    req.s3 = req.app.locals.s3Clients[bucketName];
    next();
};