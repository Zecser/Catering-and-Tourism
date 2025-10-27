import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt-token";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        const authHeader = req.headers.authorization;

        if (!authHeader) return res.status(401).json({ message: "Unauthorized: No token provided" });

        // Extract token from header
        const token = authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ message: "Unauthorized" });

        // Verify JWT access token
        const decoded = verifyAccessToken(token);

        if (!decoded || !decoded.userId) return res.status(401).json({ message: "Unauthorized" });

        // Set data into the req
        (req as any).user = { role: decoded.role, userId: decoded.userId };
        next()

};