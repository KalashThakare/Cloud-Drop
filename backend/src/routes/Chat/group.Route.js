import express from "express";
import {protectRoute} from "../../middleware/auth.middleware.js"
import { addMembersByEmail, createGroup, exitGroup, removeMember, terminateGroup, assignRole } from "../../controller/Chat/group.js";

const router  = express.Router();

router.post("/create",protectRoute,createGroup);

router.post("/add-member",protectRoute,addMembersByEmail);

router.post("/:groupId/remove-member",protectRoute,removeMember);

router.post("/roles",protectRoute,assignRole);

router.post("/:groupId/exit",protectRoute,exitGroup);

router.post("/terminate",protectRoute,terminateGroup);

export default router;