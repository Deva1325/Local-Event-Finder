import express from "express";
import { approveOrganizer, rejectOrganizer, getAdminDashboard } from "../controllers/AdminController";
import { adminBearerToken } from "../middleware/adminBearerToken";

const router = express.Router();

router.put("/approve-organizer/:id", adminBearerToken, approveOrganizer);
router.put("/reject-organizer/:id", adminBearerToken, rejectOrganizer);
router.get("/adminDashboard", adminBearerToken, getAdminDashboard);

export default router;      