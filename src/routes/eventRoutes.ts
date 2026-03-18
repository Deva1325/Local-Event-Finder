import express  from "express";
import { createEvent,updateEvent } from "../controllers/EventController";
import { bearerToken } from "../middleware/bearerToken";
import { authorizeRoles } from "../middleware/authorizeRoles";
import upload from "../middleware/upload";

const router=express.Router();

router.post("/create",bearerToken,authorizeRoles("organizer"),createEvent);
router.put("/:event_id",bearerToken,authorizeRoles("organizer"),upload.single("image"),updateEvent);
export default router;