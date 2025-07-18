import express from "express";
import { protectRoute } from "../../middleware/auth.middleware.js";
import { getMessages,sendMessage,getGroups } from "../../controller/Chat/messages.js";

const router = express.Router();

router.get("/rooms",protectRoute,getGroups);

router.post("/send",protectRoute,sendMessage);

router.post("/getMessages",protectRoute,getMessages);


export default router;