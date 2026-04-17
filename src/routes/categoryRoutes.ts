import express from "express";
import { createCategory, getCategory, getCategoryById, updateCategory, deleteCategory } from "../controllers/CategoryController";
import { bearerToken } from "../middleware/bearerToken";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = express.Router();

//Admin only
router.post("/", bearerToken, authorizeRoles("admin"), createCategory);

router.get("/", getCategory);
router.get("/:id", getCategoryById);

router.put("/:id", bearerToken, authorizeRoles("admin"), updateCategory);
router.delete("/:id", bearerToken, authorizeRoles("admin"), deleteCategory);

export default router;
