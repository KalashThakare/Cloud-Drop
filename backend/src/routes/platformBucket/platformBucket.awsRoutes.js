import express from "express"
import { protectRoute } from "../../middleware/auth.middleware.js";
import { createS3Client } from "../../lib/platformClient/s3.js";
import { Upload } from "../../controller/platformBucket/cloud.Controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({storage:storage})

router.post("/s3client", protectRoute, createS3Client);
router.post("/s3client/upload", (req, res, next) => {
    console.log("Raw incoming request body:", req.body);
    next();
},upload.single("image"), Upload);

export default router;