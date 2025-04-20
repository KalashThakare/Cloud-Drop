import express from "express";
import {protectRoute} from "../../middleware/auth.middleware.js"
import { addMembersByEmail, createGroup } from "../../controller/Chat/group.js";

const router  = express.Router();

router.post("/create",protectRoute,createGroup);

router.post("/:groupId/add-member",protectRoute,addMembersByEmail);

export default router;