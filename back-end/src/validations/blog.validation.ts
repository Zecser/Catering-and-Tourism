// src/middleware/blogValidation.ts
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export interface ValidatedBlogRequest extends Request {
  validatedData?: any;
}

// Validation schemas
const blogValidationRules = {
  title: {
    required: true,
    type: "string",
    minLength: 5,
    maxLength: 200,
    message: "Title is required and must be between 5-200 characters"
  },
  description: {
    required: true,
    type: "string",
    minLength: 20,
    maxLength: 10000,
    message: "Description is required and must be between 20-10000 characters"
  },
  content: {
    required: false, // Allow content as alias for description
    type: "string",
    minLength: 20,
    maxLength: 10000,
    message: "Content must be between 20-10000 characters"
  },
  keepImages: {
    required: false,
    type: "array",
    message: "keepImages must be an array of public_ids"
  }
};

// Validation helper
const validateField = (value: any, rules: any, fieldName: string): string[] => {
  const errors: string[] = [];

  // Required check
  if (rules.required && (value === undefined || value === null || value === "")) {
    errors.push(`${fieldName} is required`);
    return errors;
  }

  // Skip other validations if field is not required and empty
  if (!rules.required && (value === undefined || value === null || value === "")) {
    return errors;
  }

  // Type validation
  if (rules.type === "string" && typeof value !== "string") {
    errors.push(`${fieldName} must be a string`);
    return errors;
  }

  if (rules.type === "array") {
    if (!Array.isArray(value)) {
      // Try to parse JSON string
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) {
            errors.push(`${fieldName} must be an array`);
            return errors;
          }
        } catch {
          errors.push(`${fieldName} must be a valid JSON array`);
          return errors;
        }
      } else {
        errors.push(`${fieldName} must be an array`);
        return errors;
      }
    }
  }

  // Length validation for strings
  if (rules.type === "string" && typeof value === "string") {
    const trimmedValue = value.trim();
    if (rules.minLength && trimmedValue.length < rules.minLength) {
      errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
    }
    if (rules.maxLength && trimmedValue.length > rules.maxLength) {
      errors.push(`${fieldName} must be less than ${rules.maxLength} characters`);
    }
  }

  return errors;
};

// Sanitize input data
const sanitizeBlogData = (data: any) => {
  const sanitized: any = {};

  if (data.title !== undefined) {
    sanitized.title = data.title.toString().trim();
  }
  
  // Handle both 'description' and 'content' fields (content is alias for description)
  if (data.description !== undefined) {
    sanitized.description = data.description.toString().trim();
  } else if (data.content !== undefined) {
    sanitized.description = data.content.toString().trim();
  }
  
  if (data.keepImages !== undefined) {
    // Handle keepImages as JSON string or array
    if (typeof data.keepImages === "string") {
      try {
        sanitized.keepImages = JSON.parse(data.keepImages);
      } catch {
        sanitized.keepImages = [];
      }
    } else if (Array.isArray(data.keepImages)) {
      sanitized.keepImages = data.keepImages;
    }
  }

  return sanitized;
};

// Middleware for validating blog creation
export const validateCreateBlog = (req: ValidatedBlogRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: "Request body is required",
        errors: ["Request body cannot be empty"]
      });
      return;
    }

    const sanitizedData = sanitizeBlogData(req.body);
    const errors: string[] = [];

    // Validate required fields for creation (title and description/content)
    const requiredFields = ['title', 'description'];
    requiredFields.forEach(fieldName => {
      const rules = blogValidationRules[fieldName as keyof typeof blogValidationRules];
      const fieldErrors = validateField(sanitizedData[fieldName], rules, fieldName);
      errors.push(...fieldErrors);
    });

    // Validate file uploads
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 10) {
      errors.push("Maximum 10 images allowed per blog post");
    }

    // Validate individual file sizes and types
    if (files && files.length > 0) {
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      files.forEach((file, index) => {
        if (file.size > maxFileSize) {
          errors.push(`Image ${index + 1}: File size must be less than 10MB`);
        }
        if (!allowedTypes.includes(file.mimetype)) {
          errors.push(`Image ${index + 1}: Only JPEG, PNG, GIF, and WebP images are allowed`);
        }
      });
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
      return;
    }

    req.validatedData = sanitizedData;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Validation error",
      errors: ["An error occurred during validation"]
    });
    return;
  }
};

// Middleware for validating blog updates
export const validateUpdateBlog = (req: ValidatedBlogRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: "Request body is required",
        errors: ["At least one field must be provided for update"]
      });
      return;
    }

    // Filter out only allowed fields
    const allowedFields = Object.keys(blogValidationRules);
    const updateData: any = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key) && req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    });

    // Allow both files and no fields for image-only updates
    const files = req.files as Express.Multer.File[];
    if (Object.keys(updateData).length === 0 && (!files || files.length === 0)) {
      res.status(400).json({
        success: false,
        message: "No valid fields to update",
        errors: [`Valid fields are: ${allowedFields.join(", ")}, or upload new images`]
      });
      return;
    }

    const sanitizedData = sanitizeBlogData(updateData);
    const errors: string[] = [];

    // Validate only the fields being updated (not requiring all fields)
    Object.entries(sanitizedData).forEach(([fieldName, value]) => {
      if (blogValidationRules[fieldName as keyof typeof blogValidationRules]) {
        const rules = { ...blogValidationRules[fieldName as keyof typeof blogValidationRules] };
        // Make field not required for updates
        rules.required = false;
        const fieldErrors = validateField(value, rules, fieldName);
        errors.push(...fieldErrors);
      }
    });

    // Validate file uploads
    if (files && files.length > 10) {
      errors.push("Maximum 10 images allowed per blog post");
    }

    // Validate individual file sizes and types
    if (files && files.length > 0) {
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      files.forEach((file, index) => {
        if (file.size > maxFileSize) {
          errors.push(`Image ${index + 1}: File size must be less than 10MB`);
        }
        if (!allowedTypes.includes(file.mimetype)) {
          errors.push(`Image ${index + 1}: Only JPEG, PNG, GIF, and WebP images are allowed`);
        }
      });
    }

    // Validate keepImages array if provided
    if (sanitizedData.keepImages) {
      if (!Array.isArray(sanitizedData.keepImages)) {
        errors.push("keepImages must be an array");
      } else {
        sanitizedData.keepImages.forEach((id: any, index: number) => {
          if (typeof id !== "string" || id.trim() === "") {
            errors.push(`keepImages[${index}] must be a non-empty string`);
          }
        });
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
      return;
    }

    req.validatedData = sanitizedData;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Validation error",
      errors: ["An error occurred during validation"]
    });
    return;
  }
};

// Middleware for validating ObjectId parameters
export const validateObjectId = (paramName: string = "id") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    
    if (!id) {
      res.status(400).json({
        success: false,
        message: `${paramName} parameter is required`,
        errors: [`${paramName} parameter is missing`]
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: `Invalid ${paramName}`,
        errors: [`${paramName} must be a valid MongoDB ObjectId`]
      });
      return;
    }

    next();
  };
};

// Middleware for validating query parameters
export const validateBlogQueryParams = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { limit, page, sortBy, search } = req.query;
    const errors: string[] = [];

    // Validate limit parameter
    if (limit !== undefined) {
      const limitNum = parseInt(limit as string, 10);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        errors.push("Limit must be a number between 1 and 100");
      }
    }

    // Validate page parameter
    if (page !== undefined) {
      const pageNum = parseInt(page as string, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        errors.push("Page must be a number greater than 0");
      }
    }

    // Validate sortBy parameter
    if (sortBy !== undefined) {
      const validSortFields = ["createdAt", "updatedAt", "title"];
      if (!validSortFields.includes(sortBy as string)) {
        errors.push(`Sort field must be one of: ${validSortFields.join(", ")}`);
      }
    }

    // Validate search parameter
    if (search !== undefined) {
      const searchStr = search as string;
      if (searchStr.length < 2) {
        errors.push("Search term must be at least 2 characters long");
      }
      if (searchStr.length > 100) {
        errors.push("Search term must be less than 100 characters");
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Query validation error",
      errors: ["An error occurred during query validation"]
    });
    return;
  }
};