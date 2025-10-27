import { Router } from 'express';
import { signup, adminSignup, login, refreshToken, forgotPassword, verifyOTP, resetPassword, getMe, logout } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router()

// Public routes (no authentication required)
router.post("/signup", signup);
router.post("/admin-signup", adminSignup);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);

// Protected routes (authentication required)
router.get("/me", authMiddleware, getMe);

export default router;
