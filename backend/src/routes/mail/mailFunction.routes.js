import express from "express";
import { reqAccess,verifyEmail } from "../../controller/sendMail.Controller.js";

const router = express.Router();

router.post("/req-access",reqAccess);

router.get("/verify",(req,res,next)=>{
    req.query;
    next();
},verifyEmail);


export default router;