import { z } from 'zod';

// Signup validation schema
export const SignupZodSchema = z.object({
    username: z
        .string({ message: 'Username is required' })
        .min(2, 'Username must be at least 2 characters')
        .max(50, 'Username must not exceed 50 characters')
        .regex(/^[a-zA-Z0-9_.-]+$/, 'Username can only contain letters, numbers, underscores, dots, and hyphens'),

    email: z
        .string({ message: 'Email is required' })
        .min(1, 'Email is required')
        .email('Please provide a valid email address')
        .max(100, 'Email must not exceed 100 characters'),

    password: z
        .string({ message: 'Password is required' })
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters')
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number'),

    confirmPassword: z
        .string({ message: 'Confirm password is required' })
        .min(1, 'Confirm password is required')
        .min(6, 'Confirm password must be at least 6 characters'),

    mobileNumber: z
        .string({ message: 'Mobile number is required' })
        .min(1, 'Mobile number is required')
        .min(10, 'Mobile number must be at least 10 digits')
        .max(10, 'Mobile number must not exceed 10 digits')
        .regex(/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid mobile number'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Admin signup validation schema 
export const AdminSignupZodSchema = z.object({
    username: z
        .string({ message: 'Username is required' })
        .min(1, 'Username is required')
        .min(2, 'Username must be at least 2 characters')
        .max(50, 'Username must not exceed 50 characters')
        .regex(/^[a-zA-Z0-9_.-]+$/, 'Username can only contain letters, numbers, underscores, dots, and hyphens'),

    email: z
        .string({ message: 'Email is required' })
        .min(1, 'Email is required')
        .email('Please provide a valid email address')
        .max(100, 'Email must not exceed 100 characters'),

    password: z
        .string({ message: 'Password is required' })
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters')
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number'),

    confirmPassword: z
        .string()
        .min(1, 'Confirm password is required')
        .min(6, 'Confirm password must be at least 6 characters')
        .max(128, 'Confirm password must not exceed 128 characters'),

    mobileNumber: z
        .string({ message: 'Mobile number is required' })
        .min(1, 'Mobile number is required')
        .min(10, 'Mobile number must be at least 10 digits')
        .max(10, 'Mobile number must not exceed 10 digits')
        .regex(/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid mobile number'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Login validation schema
export const LoginZodSchema = z.object({
    email: z
        .string({ message: 'Email is required' })
        .min(1, 'Email is required')
        .email('Please provide a valid email address'),

    password: z
        .string({ message: 'Password is required' })
        .min(1, 'Password is required'),
});

// Forgot password validation schema
export const ForgotPasswordZodSchema = z.object({
    email: z
        .string({ message: 'Email is required' })
        .min(1, 'Email is required')
        .email('Please provide a valid email address'),
});

// Verify OTP validation schema
export const VerifyOTPZodSchema = z.object({
    email: z
        .string({ message: 'Email is required' })
        .min(1, 'Email is required')
        .email('Please provide a valid email address'),

    otp: z
        .string({ message: 'OTP is required' })
        .min(1, 'OTP is required')
        .length(6, 'OTP must be exactly 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

// Reset password validation schema
export const ResetPasswordZodSchema = z.object({
    email: z
        .string({ message: 'Email is required' })
        .min(1, 'Email is required')
        .email('Please provide a valid email address'),

    otp: z
        .string({ message: 'OTP is required' })
        .min(1, 'OTP is required')
        .length(6, 'OTP must be exactly 6 digits')
        .regex(/^\d{6}$/, 'OTP must contain only numbers'),

    newPassword: z
        .string({ message: 'New password is required' })
        .min(1, 'New password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password must not exceed 128 characters')
        .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number'),

    confirmPassword: z
        .string({ message: 'Confirm password is required' })
        .min(1, 'Confirm password is required')
        .min(6, 'Confirm password must be at least 6 characters')
        .max(128, 'Confirm password must not exceed 128 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
