import express from "express";
import { Upload } from "../controller/cloud.Controller.js";
import multer from "multer";
import { attachS3Client } from "../middleware/auth.middleware.js";


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
  

export default router;