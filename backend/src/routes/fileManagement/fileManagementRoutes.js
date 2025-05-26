import express from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { getUserFiles, getUserFileStats } from "../../controller/platformBucket/file.Controller.js";

const router = express.Router();

router.post("/getFiles",protectRoute,getUserFiles);

router.post("/getUserFileStats",protectRoute,getUserFileStats);

export default router;