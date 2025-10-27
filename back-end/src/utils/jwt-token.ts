import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Response } from 'express';
import { getEnvVariable } from './helpers';

// Secrets
const ACCESS_TOKEN_SECRET = getEnvVariable('ACCESS_TOKEN_SECRET');
const REFRESH_TOKEN_SECRET = getEnvVariable('REFRESH_TOKEN_SECRET');
const OTP_SECRET = getEnvVariable('OTP_SECRET');

// Token payload interfaces
interface TokenPayloadType {
    userId: Types.ObjectId | null;
    role: 'Admin' | 'User' | null;
}

interface OTPPayloadType {
    otpId: Types.ObjectId;
}


// Generate access + refresh tokens
export const generateTokens = (payload: TokenPayloadType) => {
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });//15 m for production
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// Verify access token safely
export const verifyAccessToken = (token: string): TokenPayloadType | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayloadType;
    } catch {
        return null;
    }
};

// Verify refresh token safely
export const verifyRefreshToken = (token: string): TokenPayloadType | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayloadType;
    } catch {
        return null;
    }
};

// Refresh access token using a refresh token
export const refreshAccessToken = (refreshToken: string) => {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) throw new Error('Invalid refresh token');
    return generateTokens({ userId: decoded.userId, role: decoded.role });
};


// Encrypt OTP or verification tokens
export const generateOTPToken = (payload: OTPPayloadType) => {
    return jwt.sign(payload, OTP_SECRET, { expiresIn: '10m' });
};

// Verify OTP token
export const verifyOTPToken = (token: string): OTPPayloadType | null => {
    try {
        return jwt.verify(token, OTP_SECRET) as OTPPayloadType;
    } catch {
        return null;
    }
};


// Set refresh token in http-only cookie
export const setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

// Clear refresh token cookie (logout)
export const clearRefreshTokenCookie = (res: Response) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });
};