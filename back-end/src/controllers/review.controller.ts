import { RequestHandler } from "express";
import Review from "../models/review.model";
import mongoose from "mongoose";

// Validation helper functions
const validateReviewData = (data: any) => {
  const errors: string[] = [];

  // Name validation
  if (!data.name) {
    errors.push("Name is required");
  } else if (typeof data.name !== "string") {
    errors.push("Name must be a string");
  } else if (data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  } else if (data.name.trim().length > 100) {
    errors.push("Name must be less than 100 characters");
  }

  // Rating validation
  if (data.rating === undefined || data.rating === null) {
    errors.push("Rating is required");
  } else if (typeof data.rating !== "number" && isNaN(Number(data.rating))) {
    errors.push("Rating must be a number");
  } else {
    const rating = Number(data.rating);
    if (rating < 1 || rating > 5) {
      errors.push("Rating must be between 1 and 5");
    }
    if (!Number.isInteger(rating)) {
      errors.push("Rating must be a whole number");
    }
  }

  // Comment validation
  if (!data.comment) {
    errors.push("Comment is required");
  } else if (typeof data.comment !== "string") {
    errors.push("Comment must be a string");
  } else if (data.comment.trim().length < 10) {
    errors.push("Comment must be at least 10 characters long");
  } else if (data.comment.trim().length > 1000) {
    errors.push("Comment must be less than 1000 characters");
  }

  // Source validation (optional)
  if (data.source !== undefined && data.source !== null) {
    if (typeof data.source !== "string") {
      errors.push("Source must be a string");
    } else if (data.source.trim().length > 50) {
      errors.push("Source must be less than 50 characters");
    }
  }

  // isPublished validation (optional)
  if (data.isPublished !== undefined && data.isPublished !== null) {
    if (typeof data.isPublished !== "boolean") {
      errors.push("isPublished must be a boolean");
    }
  }

  return errors;
};

const validateObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

const sanitizeInput = (data: any) => {
  return {
    name: data.name?.toString().trim(),
    rating: Number(data.rating),
    comment: data.comment?.toString().trim(),
    source: data.source?.toString().trim() || undefined,
    isPublished: data.isPublished === true || data.isPublished === "true"
  };
};

export const createReview: RequestHandler = async (req, res) => {
  try {
    // Check if request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ 
        success: false, 
        message: "Request body is required",
        errors: ["Request body cannot be empty"]
      });
      return;
    }

    const sanitizedData = sanitizeInput(req.body);
    const validationErrors = validateReviewData(sanitizedData);

    if (validationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
      return;
    }

    // Check for duplicate reviews (same name and comment)
    const existingReview = await Review.findOne({
      name: sanitizedData.name,
      comment: sanitizedData.comment
    });

    if (existingReview) {
      res.status(409).json({
        success: false,
        message: "Duplicate review detected",
        errors: ["A review with the same name and comment already exists"]
      });
      return;
    }

    const review = await Review.create(sanitizedData);
    
    res.status(201).json({ 
      success: true, 
      message: "Review created successfully",
      data: review 
    });
  } catch (err: any) {
    console.error("Create review error:", err);
    
    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
      const mongooseErrors = Object.values(err.errors).map((error: any) => error.message);
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mongooseErrors
      });
      return;
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Duplicate entry",
        errors: ["Review with this data already exists"]
      });
      return;
    }

    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      errors: ["An unexpected error occurred"]
    });
  }
};

export const getReviews: RequestHandler = async (req, res) => {
  try {
    // Validate query parameters
    const { published, limit, page, sortBy } = req.query;
    
    let query: any = {};
    
    // Validate published parameter
    if (published !== undefined) {
      if (published !== "true" && published !== "false") {
        res.status(400).json({
          success: false,
          message: "Invalid query parameter",
          errors: ["Published parameter must be 'true' or 'false'"]
        });
        return;
      }
      query.isPublished = published === "true";
    }

    // Validate and set pagination
    const limitNum = limit ? parseInt(limit as string, 10) : 50;
    const pageNum = page ? parseInt(page as string, 10) : 1;

    if (limitNum < 1 || limitNum > 100) {
      res.status(400).json({
        success: false,
        message: "Invalid pagination",
        errors: ["Limit must be between 1 and 100"]
      });
      return;
    }

    if (pageNum < 1) {
      res.status(400).json({
        success: false,
        message: "Invalid pagination",
        errors: ["Page must be greater than 0"]
      });
      return;
    }

    // Validate sort parameter
    let sort: any = { createdAt: -1 }; // default sort
    if (sortBy) {
      const validSortFields = ["createdAt", "rating", "name"];
      const sortField = sortBy as string;
      if (!validSortFields.includes(sortField)) {
        res.status(400).json({
          success: false,
          message: "Invalid sort parameter",
          errors: [`Sort field must be one of: ${validSortFields.join(", ")}`]
        });
        return;
      }
      sort = { [sortField]: -1 };
    }

    const skip = (pageNum - 1) * limitNum;
    
    const [reviews, total] = await Promise.all([
      Review.find(query).sort(sort).limit(limitNum).skip(skip),
      Review.countDocuments(query)
    ]);

    res.json({ 
      success: true, 
      data: reviews,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });
  } catch (err: any) {
    console.error("Get reviews error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      errors: ["Failed to fetch reviews"]
    });
  }
};

export const updateReview: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!validateObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid review ID",
        errors: ["Review ID must be a valid MongoDB ObjectId"]
      });
      return;
    }

    // Check if request body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: "Request body is required",
        errors: ["At least one field must be provided for update"]
      });
      return;
    }

    // Create update object with only provided fields
    const updateData: any = {};
    const allowedFields = ["name", "rating", "comment", "source", "isPublished"];
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: "No valid fields to update",
        errors: [`Valid fields are: ${allowedFields.join(", ")}`]
      });
      return;
    }

    const sanitizedData = sanitizeInput(updateData);
    
    // Only validate fields that are being updated
    const partialValidationErrors: string[] = [];
    
    if (sanitizedData.name !== undefined) {
      const nameErrors = validateReviewData({ name: sanitizedData.name, rating: 5, comment: "test" });
      partialValidationErrors.push(...nameErrors.filter(err => err.includes("Name")));
    }
    
    if (sanitizedData.rating !== undefined) {
      const ratingErrors = validateReviewData({ name: "test", rating: sanitizedData.rating, comment: "test" });
      partialValidationErrors.push(...ratingErrors.filter(err => err.includes("Rating")));
    }
    
    if (sanitizedData.comment !== undefined) {
      const commentErrors = validateReviewData({ name: "test", rating: 5, comment: sanitizedData.comment });
      partialValidationErrors.push(...commentErrors.filter(err => err.includes("Comment")));
    }
    
    if (sanitizedData.source !== undefined) {
      const sourceErrors = validateReviewData({ name: "test", rating: 5, comment: "test comment", source: sanitizedData.source });
      partialValidationErrors.push(...sourceErrors.filter(err => err.includes("Source")));
    }
    
    if (sanitizedData.isPublished !== undefined) {
      const publishedErrors = validateReviewData({ name: "test", rating: 5, comment: "test comment", isPublished: sanitizedData.isPublished });
      partialValidationErrors.push(...publishedErrors.filter(err => err.includes("isPublished")));
    }

    if (partialValidationErrors.length > 0) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: partialValidationErrors
      });
      return;
    }

    // Check if review exists before updating
    const existingReview = await Review.findById(id);
    if (!existingReview) {
      res.status(404).json({
        success: false,
        message: "Review not found",
        errors: ["No review found with the provided ID"]
      });
      return;
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { $set: sanitizedData },
      { new: true, runValidators: true }
    );

    res.json({ 
      success: true, 
      message: "Review updated successfully",
      data: review 
    });
  } catch (err: any) {
    console.error("Update review error:", err);
    
    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
      const mongooseErrors = Object.values(err.errors).map((error: any) => error.message);
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mongooseErrors
      });
      return;
    }

    // Handle cast errors (invalid ObjectId)
    if (err.name === "CastError") {
      res.status(400).json({
        success: false,
        message: "Invalid review ID",
        errors: ["Review ID must be a valid MongoDB ObjectId"]
      });
      return;
    }

    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      errors: ["Failed to update review"]
    });
  }
};

export const deleteReview: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!validateObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid review ID",
        errors: ["Review ID must be a valid MongoDB ObjectId"]
      });
      return;
    }

    // Check if review exists before deleting
    const existingReview = await Review.findById(id);
    if (!existingReview) {
      res.status(404).json({
        success: false,
        message: "Review not found",
        errors: ["No review found with the provided ID"]
      });
      return;
    }

    await Review.findByIdAndDelete(id);
    
    res.json({ 
      success: true, 
      message: "Review deleted successfully",
      data: { deletedId: id }
    });
  } catch (err: any) {
    console.error("Delete review error:", err);
    
    // Handle cast errors (invalid ObjectId)
    if (err.name === "CastError") {
      res.status(400).json({
        success: false,
        message: "Invalid review ID",
        errors: ["Review ID must be a valid MongoDB ObjectId"]
      });
      return;
    }

    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      errors: ["Failed to delete review"]
    });
  }
};

// Additional utility function for getting a single review
export const getReviewById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!validateObjectId(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid review ID",
        errors: ["Review ID must be a valid MongoDB ObjectId"]
      });
      return;
    }

    const review = await Review.findById(id);
    
    if (!review) {
      res.status(404).json({
        success: false,
        message: "Review not found",
        errors: ["No review found with the provided ID"]
      });
      return;
    }

    res.json({ 
      success: true, 
      data: review 
    });
  } catch (err: any) {
    console.error("Get review by ID error:", err);
    
    // Handle cast errors (invalid ObjectId)
    if (err.name === "CastError") {
      res.status(400).json({
        success: false,
        message: "Invalid review ID",
        errors: ["Review ID must be a valid MongoDB ObjectId"]
      });
      return;
    }

    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      errors: ["Failed to fetch review"]
    });
  }
};