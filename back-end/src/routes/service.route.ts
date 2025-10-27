import { Router } from "express";
import {
    listServices,
    createService,
    listTitles,
    getDetailedService,
    updateService,
    deleteService,
} from "../controllers/service.controller";
import { imageUpload } from "../middlewares/cloudinary.middleware";
import bannerRoutes from "./banner.route";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Service routes
router.get("/", listServices);
router.post("/", authMiddleware, imageUpload.single("image"), createService);
router.get("/titles", listTitles);
router.get("/:id", getDetailedService);
router.put("/:id", authMiddleware, imageUpload.single("image"), updateService);
router.delete("/:id", authMiddleware, deleteService);

//  Add banner routes under /services/banners
router.use("/banners", bannerRoutes);

export default router;
