import express from "express";
import { Upload } from "../controller/cloud.Controller.js";
import multer from "multer";


const router  = express.Router();

const storage = multer.memoryStorage()
const upload = multer({storage:storage})

router.post("/upload",upload.single('image'),Upload);

export default router;