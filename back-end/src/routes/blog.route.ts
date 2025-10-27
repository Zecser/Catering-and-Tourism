// src/routes/blog.route.ts
import { Router } from "express";
import * as blogController from "../controllers/blog.controller";
import { imageUpload } from "../middlewares/cloudinary.middleware";
import { validateBlogQueryParams, validateCreateBlog, validateObjectId, validateUpdateBlog } from "../validations/blog.validation";



const router = Router();

// Create blog with validation (images + data validation)
router.post(
  "/", 
  imageUpload.array("images", 10), 
  validateCreateBlog, 
  blogController.createBlog
);

// Get all blogs with query parameter validation
router.get(
  "/", 
  validateBlogQueryParams, 
  blogController.getBlogs
);

// Get single blog by ID with ID validation
router.get(
  "/:id", 
  validateObjectId(), 
  blogController.getBlogById
);

// Update blog with ID validation, image handling, and data validation
router.put(
  "/:id", 
  validateObjectId(), 
  imageUpload.array("images", 10), 
  validateUpdateBlog, 
  blogController.updateBlog
);

// Delete blog with ID validation
router.delete(
  "/:id", 
  validateObjectId(), 
  blogController.deleteBlog
);

export default router;