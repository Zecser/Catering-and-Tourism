import { Router } from "express";
import {uploadHeroBanner,uploadBanner,getBanners,updateBanner,deleteBanner} from "../controllers/home.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { imageUpload } from '../middlewares/cloudinary.middleware';

const router = Router();

router.post("/hero",authMiddleware,imageUpload.single("image"), uploadHeroBanner);
router.post("/banner",authMiddleware, imageUpload.single("image"), uploadBanner);
router.get("/", getBanners);
router.put( "/:id",authMiddleware, imageUpload.single("image"), updateBanner);
router.delete("/:id", authMiddleware, deleteBanner);

export default router;
