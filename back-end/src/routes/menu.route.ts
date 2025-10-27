import { Router } from 'express';
import {
    getCategories,
    getCategory,
    addCategory,
    deleteCategory,
    addItem,
    editItem,
    deleteItem,
} from "../controllers/menu.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes (no authentication required)
router.get("/", getCategories);
router.get("/category/:id", getCategory);

// Protected routes (authentication required)
router.post("/category", authMiddleware, addCategory);
router.delete("/category/:id", authMiddleware, deleteCategory);

// Items - all require authentication
router.post("/item/:categoryId", authMiddleware, addItem);
router.put("/item/:categoryId/:itemIndex", authMiddleware, editItem);
router.delete("/item/:categoryId/:itemIndex", authMiddleware, deleteItem);

export default router;
