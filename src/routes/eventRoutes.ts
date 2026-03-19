import express  from "express";
import { createEvent,updateEvent,getAllEvent,getEventById ,deleteEvent} from "../controllers/EventController";
import { bearerToken } from "../middleware/bearerToken";
import { authorizeRoles } from "../middleware/authorizeRoles";
import upload from "../middleware/upload";

const router=express.Router();

router.get("/",getAllEvent);
router.get("/:id",getEventById);
router.post("/create",bearerToken,authorizeRoles("organizer"),upload.single("image"),createEvent);
router.put("/:id",bearerToken,authorizeRoles("organizer"),upload.single("image"),updateEvent);
router.delete("/:id",bearerToken,authorizeRoles("organizer"),deleteEvent);

export default router;