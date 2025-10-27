import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { OTP } from '../models/otp.model';
import { generateTokens, refreshAccessToken } from '../utils/jwt-token';
import { sendOTPEmail } from '../utils/email';
import { generateOtp } from '../utils/generate-otp';
import { Types } from 'mongoose';
import { SignupZodSchema, AdminSignupZodSchema, LoginZodSchema, ForgotPasswordZodSchema, VerifyOTPZodSchema, ResetPasswordZodSchema } from '../validations/auth.validations';

const SALT_ROUNDS = 10;

export const signup: RequestHandler = async (req, res) => {
    try {
        const validation = SignupZodSchema.safeParse(req.body);

        if (!validation.success) {
            const errors = validation.error.issues.map(err => ({
                message: err.message
            }));
            res.status(400).json({
                message: 'Validation failed',
                errors
            });
            return;
        }

        const { username, email, password, mobileNumber } = validation.data;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Email already registered' });
            return;
        }

        // Create user (password will be hashed by Mongoose pre-save hook)
        const user = await User.create({
            username,
            email,
            password,
            mobileNumber,
            role: 'User',
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens({ userId: user._id as Types.ObjectId, role: user.role });

        // Send refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                user_name: user.username,
                email: user.email,
                phoneNumber: user.mobileNumber,
                role: user.role,
            },
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
export const adminSignup: RequestHandler = async (req, res) => {
    try {
        const validation = AdminSignupZodSchema.safeParse(req.body);

        if (!validation.success) {
            const errors = validation.error.issues.map(err => ({
                message: err.message
            }));
            res.status(400).json({
                message: 'Validation failed',
                errors
            });
            return;
        }

        const { username, email, password, mobileNumber } = validation.data;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Email already registered' });
            return;
        }

        // Create admin user
        const user = await User.create({
            username,
            email,
            password,
            mobileNumber,
            role: 'Admin',
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens({ userId: user._id as Types.ObjectId, role: user.role });

        // Send refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            message: 'Admin registered successfully',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                user_name: user.username,
                email: user.email,
                phoneNumber: user.mobileNumber,
                role: user.role,

            },
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
export const login: RequestHandler = async (req, res) => {
    try {
        const validation = LoginZodSchema.safeParse(req.body);

        if (!validation.success) {
            const errors = validation.error.issues.map(err => ({
                message: err.message
            }));
            res.status(400).json({
                message: 'Validation failed',
                errors
            });
            return;
        }

        const { email, password } = validation.data;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        if (!user.password || typeof user.password !== 'string') {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await (user as any).comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const { accessToken, refreshToken } = generateTokens({ userId: user._id as Types.ObjectId, role: user.role });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        res.json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                user_name: user.username,
                email: user.email,
                phoneNumber: user.mobileNumber,
                role: user.role,
            },
        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Refresh Access Token
export const refreshToken: RequestHandler = (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            res.status(401).json({ message: 'No refresh token provided' });
            return;
        }

        const newTokens = refreshAccessToken(token);

        res.cookie('refreshToken', newTokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken: newTokens.accessToken });
    } catch (err: any) {
        console.error(err);
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

// Forgot Password - send OTP to email
export const forgotPassword: RequestHandler = async (req, res) => {
    try {
        const validation = ForgotPasswordZodSchema.safeParse(req.body);

        if (!validation.success) {
            const errors = validation.error.issues.map(err => ({
                message: err.message
            }));
            res.status(400).json({
                message: 'Validation failed',
                errors
            });
            return;
        }

        const { email } = validation.data;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        // Generate OTP
        const otp = generateOtp(6);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Delete any existing OTPs for this user and purpose
        await OTP.deleteMany({
            userId: user._id,
            purpose: 'password_reset'
        });

        // Save new OTP
        await OTP.create({
            userId: user._id,
            otp,
            purpose: 'password_reset',
            expiresAt
        });

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.json({ message: 'OTP sent to email for password reset' });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify OTP
export const verifyOTP: RequestHandler = async (req, res) => {
    try {
        const validation = VerifyOTPZodSchema.safeParse(req.body);

        if (!validation.success) {
            const errors = validation.error.issues.map(err => ({
                message: err.message
            }));
            res.status(400).json({
                message: 'Validation failed',
                errors
            });
            return;
        }

        const { email, otp } = validation.data;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        // Find valid OTP
        const otpRecord = await OTP.findOne({
            userId: user._id,
            otp,
            purpose: 'password_reset',
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password
export const resetPassword: RequestHandler = async (req, res) => {
    try {
        const validation = ResetPasswordZodSchema.safeParse(req.body);

        if (!validation.success) {
            const errors = validation.error.issues.map(err => ({
                message: err.message
            }));
            res.status(400).json({
                message: 'Validation failed',
                errors
            });
            return;
        }

        const { email, otp, newPassword } = validation.data;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        // Find valid OTP
        const otpRecord = await OTP.findOne({
            userId: user._id,
            otp,
            purpose: 'password_reset',
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            res.status(400).json({ message: 'Invalid or expired OTP' });
            return;
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Update user password
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        // Mark OTP as used
        await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });

        res.json({ message: 'Password reset successfully' });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get current user profile
export const getMe: RequestHandler = async (req, res) => {
    try {
        const userId = (req as any).user.userId;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            id: user._id,
            user_name: user.username,
            email: user.email,
            password: user.password,
            phoneNumber: user.mobileNumber,
            role: user.role,

        });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const logout: RequestHandler = async (_req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        })

        res.status(200).json({ message: "Logged out successfully" })
        return;
    } catch (error) {
        console.error("Logout error:", error)
        res.status(500).json({ message: "Logout failed" })

    }
}