import jwt from "jsonwebtoken";
import User from "../models/user.Model.js";
import dotenv from "dotenv";
import { BlacklistToken } from "../models/blacklistToken.model.js";
dotenv.config();

export const protectRoute= async (req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }

    const isBlacklisted=await BlacklistToken.findOne({token:token});

    if(isBlacklisted){
        return res.status(401).json({message:'Unauthorized'});
    }

    try {

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded._id);

        req.user=user;

        return next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({message:'Unauthorized'})
    }
}

export const attachS3Client = (req, res, next) => {
    const bucketName = req.body.bucketName || req.query.bucketName;

    if (!bucketName) {
        return res.status(400).json({ message: "Please connect to a bucket first." });
    }

    if (!req.app.locals.s3Clients || !req.app.locals.s3Clients[bucketName]) {
        return res.status(400).json({ message: "Bucket not connected." });
    }

    req.s3 = req.app.locals.s3Clients[bucketName];
    next();
};