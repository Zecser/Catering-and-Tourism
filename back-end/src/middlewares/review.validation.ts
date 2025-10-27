// src/middleware/reviewValidation.ts
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export interface ValidatedRequest extends Request {
  validatedData?: any;
}

// Validation schemas
const reviewValidationRules = {
  name: {
    required: true,
    type: "string",
    minLength: 2,
    maxLength: 100,
    message: "Name is required and must be between 2-100 characters"
  },
  rating: {
    required: true,
    type: "number",
    min: 1,
    max: 5,
    integer: true,
    message: "Rating is required and must be an integer between 1-5"
  },
  comment: {
    required: true,
    type: "string",
    minLength: 10,
    maxLength: 1000,
    message: "Comment is required and must be between 10-1000 characters"
  },
  source: {
    required: false,
    type: "string",
    maxLength: 50,
    message: "Source must be less than 50 characters"
  },
  isPublished: {
    required: false,
    type: "boolean",
    message: "isPublished must be a boolean value"
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
  }

  if (rules.type === "number") {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      errors.push(`${fieldName} must be a number`);
      return errors;
    }
    
    // Integer check
    if (rules.integer && !Number.isInteger(numValue)) {
      errors.push(`${fieldName} must be an integer`);
    }
    
    // Min/Max for numbers
    if (rules.min !== undefined && numValue < rules.min) {
      errors.push(`${fieldName} must be at least ${rules.min}`);
    }
    if (rules.max !== undefined && numValue > rules.max) {
      errors.push(`${fieldName} must be at most ${rules.max}`);
    }
  }

  if (rules.type === "boolean" && typeof value !== "boolean") {
    // Allow string boolean conversion
    if (value !== "true" && value !== "false") {
      errors.push(`${fieldName} must be a boolean`);
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
const sanitizeReviewData = (data: any) => {
  const sanitized: any = {};

  if (data.name !== undefined) {
    sanitized.name = data.name.toString().trim();
  }
  
  if (data.rating !== undefined) {
    sanitized.rating = Number(data.rating);
  }
  
  if (data.comment !== undefined) {
    sanitized.comment = data.comment.toString().trim();
  }
  
  if (data.source !== undefined && data.source !== null) {
    sanitized.source = data.source.toString().trim() || undefined;
  }
  
  if (data.isPublished !== undefined) {
    sanitized.isPublished = data.isPublished === true || data.isPublished === "true";
  }

  return sanitized;
};

// Middleware for validating review creation
export const validateCreateReview = (req: ValidatedRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({
        success: false,
        message: "Request body is required",
        errors: ["Request body cannot be empty"]
      });
      return;
    }

    const sanitizedData = sanitizeReviewData(req.body);
    const errors: string[] = [];

    // Validate all required fields for creation
    Object.entries(reviewValidationRules).forEach(([fieldName, rules]) => {
      const fieldErrors = validateField(sanitizedData[fieldName], rules, fieldName);
      errors.push(...fieldErrors);
    });

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

// Middleware for validating review updates
export const validateUpdateReview = (req: ValidatedRequest, res: Response, next: NextFunction): void => {
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
    const allowedFields = Object.keys(reviewValidationRules);
    const updateData: any = {};
    
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

    const sanitizedData = sanitizeReviewData(updateData);
    const errors: string[] = [];

    // Validate only the fields being updated (not requiring all fields)
    Object.entries(sanitizedData).forEach(([fieldName, value]) => {
      if (reviewValidationRules[fieldName as keyof typeof reviewValidationRules]) {
        const rules = { ...reviewValidationRules[fieldName as keyof typeof reviewValidationRules] };
        // Make field not required for updates
        rules.required = false;
        const fieldErrors = validateField(value, rules, fieldName);
        errors.push(...fieldErrors);
      }
    });

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
export const validateQueryParams = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { published, limit, page, sortBy } = req.query;
    const errors: string[] = [];

    // Validate published parameter
    if (published !== undefined && published !== "true" && published !== "false") {
      errors.push("Published parameter must be 'true' or 'false'");
    }

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
      const validSortFields = ["createdAt", "rating", "name", "updatedAt"];
      if (!validSortFields.includes(sortBy as string)) {
        errors.push(`Sort field must be one of: ${validSortFields.join(", ")}`);
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

