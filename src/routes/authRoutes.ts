import express from "express";
import { register, login, refreshAccessToken, verifyEmail, logout, forgotPassword, resetPassword, getProfile, updateProfile } from "../controllers/AuthController";
import { bearerToken } from "../middleware/bearerToken";

const router = express.Router();

router.post('/register', register);
router.get("/verify-email", verifyEmail);

router.post('/login', login);
router.post('/refresh-token', refreshAccessToken); // refresh token 
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/profile", bearerToken, getProfile);
router.put("/update-profile", bearerToken, updateProfile);

export default router;

