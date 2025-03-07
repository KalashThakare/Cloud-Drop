import express from "express";
import { upload } from "../controller/cloud.Controller.js";

const router  = express.Router();

router.post("/upload",upload);

export default router;