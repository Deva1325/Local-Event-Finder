import express from "express";
import { approveOrganizer, rejectOrganizer, getAdminDashboard ,getAllOrganizers} from "../controllers/AdminController";
import { bearerToken } from "../middleware/bearerToken";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = express.Router();

router.get("/organizers",bearerToken,authorizeRoles("admin"),getAllOrganizers);
router.get("/adminDashboard",  bearerToken,authorizeRoles("admin"), getAdminDashboard);

router.put("/approve-organizer/:id", bearerToken,authorizeRoles("admin"), approveOrganizer);
router.put("/reject-organizer/:id",  bearerToken,authorizeRoles("admin"), rejectOrganizer);

export default router;      