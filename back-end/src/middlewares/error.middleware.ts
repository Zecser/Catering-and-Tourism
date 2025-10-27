import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): any => {

    if (err instanceof ZodError) {
        return res.status(400).json({ message: 'Validation failed.' });
    }

    if (err instanceof MulterError) {
        return res.status(400).json({ message: err.message });
    }

    if (
        err instanceof Error &&
        (err.message === "jwt expired" || err.message === "invalid signature")
    ) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    if (err.message?.includes('Only image')) {
        return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({
        message: 'Something went wrong!',
    });
};
