import { Router } from "express";
import { awsConfig, connectToBucket } from "../controller/aws.Controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/config",protectRoute,awsConfig);
router.post('/connect',protectRoute,connectToBucket);

export default router;