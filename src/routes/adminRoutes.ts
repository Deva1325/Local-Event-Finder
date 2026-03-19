import express from "express";
import { approveOrganizer } from "../controllers/AdminController";
import { adminBearerToken } from "../middleware/adminBearerToken";

const router = express.Router();

router.put("/verifyorganizer/:id",adminBearerToken,approveOrganizer);

export default router;