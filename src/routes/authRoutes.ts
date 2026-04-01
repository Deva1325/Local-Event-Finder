import express from "express";
import { register, login, refreshAccessToken, verifyEmail, logout, forgotPassword, resetPassword, getProfile } from "../controllers/AuthController";
import { bearerToken } from "../middleware/bearerToken";

const router = express.Router();

router.post('/register', register);
router.get("/verify-email", verifyEmail);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", bearerToken, getProfile);
export default router;

