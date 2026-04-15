import express from "express";
import { createEvent, updateEvent, getAllEvent, getEventById, deleteEvent, cancelEvent,getEventsByOrganizer } from "../controllers/EventController";
import { bearerToken } from "../middleware/bearerToken";
import { authorizeRoles } from "../middleware/authorizeRoles";
import upload from "../middleware/upload";

const router = express.Router();

router.get("/", getAllEvent);
router.get('/my-events',bearerToken,authorizeRoles("organizer"),getEventsByOrganizer);
router.post("/create", bearerToken, authorizeRoles("organizer"), upload.single("image"), createEvent);

router.put("/cancel/:id", bearerToken, authorizeRoles("organizer"), cancelEvent);

router.get("/:id", getEventById);
router.put("/:id", bearerToken, authorizeRoles("organizer"), upload.single("image"), updateEvent);
router.delete("/:id", bearerToken, authorizeRoles("organizer"), deleteEvent);



export default router;