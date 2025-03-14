import { Router } from "express";
import { awsConfig } from "../controller/aws.Controller";

const router = Router();

router.post("/config",awsConfig);

export default router;