import express from "express"
import { protectRoute } from "../../middleware/auth.middleware.js";
import { createS3Client } from "../../lib/platformClient/s3.js";
import { deleteMultipleFiles, generateSignedUrl, Upload } from "../../controller/platformBucket/cloud.Controller.js";
import mailRoute from "../mail/mailFunction.routes.js"
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (increase for video support)
  }
});

router.post("/s3client", protectRoute, createS3Client);
router.post("/s3client/upload", (req, res, next) => {
    console.log("Raw incoming request body:", req.body);
    next();
},upload.array("images"), Upload);

router.post("/getUrl",protectRoute,generateSignedUrl)

router.use("/sendMail",mailRoute)

router.post("/s3client/delete-multiple", protectRoute, deleteMultipleFiles);

export default router;