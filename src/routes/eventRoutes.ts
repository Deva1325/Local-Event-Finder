import express  from "express";
import { createEvent } from "../controllers/EventController";
import { bearerToken } from "../middleware/bearerToken";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router=express.Router();

router.post("/create",bearerToken,authorizeRoles("organizer"),createEvent);

export default router;