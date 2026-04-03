import express from "express";
import { approveOrganizer, rejectOrganizer, getAdminDashboard } from "../controllers/AdminController";
import { bearerToken } from "../middleware/bearerToken";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = express.Router();

router.put("/approve-organizer/:id", bearerToken,authorizeRoles("admin"), approveOrganizer);
router.put("/reject-organizer/:id",  bearerToken,authorizeRoles("admin"), rejectOrganizer);
router.get("/adminDashboard",  bearerToken,authorizeRoles("admin"), getAdminDashboard);

export default router;      