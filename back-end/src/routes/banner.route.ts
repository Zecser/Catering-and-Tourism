import { Router } from "express";
import { uploadBanner, updateBanner, deleteBanner, listBanners } from "../controllers/banner.controller";
import { imageUpload } from "../middlewares/cloudinary.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Banner routes
router.get("/", listBanners); // List all banners
router.post("/", authMiddleware, imageUpload.single("image"), uploadBanner); // Upload banner
router.put("/:id", authMiddleware, imageUpload.single("image"), updateBanner); // Update banner
router.delete("/:id", authMiddleware, deleteBanner); // Delete banner

export default router;
