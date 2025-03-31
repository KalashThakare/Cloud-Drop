import express from "express";
import { generateSignedUrl, Upload } from "../controller/cloud.Controller.js";
import multer from "multer";
import { attachS3Client } from "../middleware/auth.middleware.js";
import { reqAccess,verifyEmail } from "../controller/sendMail.Controller.js";



const router  = express.Router();

const storage = multer.memoryStorage()
const upload = multer({storage:storage})

router.post(
  "/upload",
  (req, res, next) => { 
    console.log("Raw incoming request body:", req.body); 
    next();
  },
  upload.single("image"),
  attachS3Client, 
  Upload
);

router.post("/req-access",(req, res, next) => { 
  console.log("Raw incoming request body:", req.body); 
  next();
},attachS3Client,reqAccess);

router.get("/verify",verifyEmail);



router.post("/signedurl",(req, res, next) => { 
  console.log("Raw incoming request body:", req.body); 
  next();
},attachS3Client,generateSignedUrl)
  

export default router;