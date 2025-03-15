import { Router } from "express";
import { awsConfig } from "../controller/aws.Controller.js";

const router = Router();

router.post("/config",awsConfig);

export default router;