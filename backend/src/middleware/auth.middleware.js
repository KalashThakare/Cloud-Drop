import jwt from "jsonwebtoken";
import User from "../models/user.Model.js";

export const protectRoute =async (req,res,next)=>{
    try {

        const token = req.cookie.jwt;

        if(!token){
            return res.status(401).json({messagge:"Unauthorised -No token provided"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({messagge:"Unauthorised"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(401).json({message:"user not found"});
        }

        req.user=user

        next();
        
    } catch (error) {
        
    }
}