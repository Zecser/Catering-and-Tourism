import { Router } from "express";
import { 
  createReview, 
  getReviews, 
  updateReview, 
  deleteReview, 
  getReviewById 
} from "../controllers/review.controller";
import { 
  validateCreateReview, 
  validateUpdateReview, 
  validateObjectId, 
  validateQueryParams 
} from "../middlewares/review.validation";

const router = Router();

// Public routes with validation

// Get all reviews with query validation (supports pagination, filtering, sorting)
// Query params: ?published=true&limit=10&page=1&sortBy=createdAt
router.get('/', validateQueryParams, getReviews);

// Get single review by ID with ID validation
router.get('/:id', validateObjectId(), getReviewById);

// Create new review with full validation
router.post('/', validateCreateReview, createReview);

// Update existing review with ID and data validation
router.put('/:id', validateObjectId(), validateUpdateReview, updateReview);

// Delete review with ID validation
router.delete('/:id', validateObjectId(), deleteReview);

export default router;