import express from "express";
import { createCategory ,getCategory } from "../controllers/CategoryController";
import { bearerToken } from "../middleware/bearerToken";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router=express.Router();

//Admin only
router.post("/",bearerToken,authorizeRoles("admin"),createCategory);
router.get("/",getCategory);

export default router;