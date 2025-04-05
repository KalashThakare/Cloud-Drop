import { Router } from "express";
import multer from "multer";
import { awsConfig, connectToBucket, deleteBucket, fetchBucket } from "../../controller/aws.Controller.js";
import { protectRoute } from "../../middleware/auth.middleware.js";
import assumeRole from "../../lib/assumeRole.js";
import { getS3Client } from "../../lib/userClient/s3client.js";
import { uploadFileToS3 } from "../../controller/userBucketController/cloud.Controller.js";

const router = Router();

const storage = multer.memoryStorage()
const upload = multer({storage:storage})

// router.post("/config",protectRoute,awsConfig);
// router.post('/connect',protectRoute,connectToBucket);
// router.get('/buckets',protectRoute,fetchBucket);
// router.post('/delete',protectRoute,deleteBucket);

router.post("/connect", protectRoute, assumeRole);
router.post("/connect/upload", protectRoute,
    (req, res, next) => {
        console.log("Raw incoming request body:", req.body);
        next();
    },
    upload.single("image"), getS3Client,uploadFileToS3
)

export default router;