import { Router } from "express";
import { awsConfig, connectToBucket } from "../controller/aws.Controller.js";

const router = Router();

router.post("/config",awsConfig);
router.post('/connect',connectToBucket);

export default router;