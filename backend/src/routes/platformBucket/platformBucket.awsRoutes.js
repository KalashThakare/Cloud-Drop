import express from "express"
import { protectRoute } from "../../middleware/auth.middleware.js";
import { createS3Client } from "../../lib/platformClient/s3.js";
import { Upload } from "../../controller/cloud.Controller.js";

const router = express.Router();

router.post("/s3client",protectRoute,createS3Client);
router.post("/s3client/upload",protectRoute,Upload);

export default router;