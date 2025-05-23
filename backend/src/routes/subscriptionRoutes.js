import express from "express";
import { subscribeToPlan } from "../controller/Subscribtion/planController.js";


const router = express.Router();

router.post("/subscribe",subscribeToPlan);

export default router;
