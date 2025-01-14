import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
            }
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(403).json({
            message: "Invalid authorization header"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: number };
        req.user = { id: payload.id }; // Set as number
        next();
    } catch (e) {
        console.error("Auth error:", e);
        return res.status(403).json({
            message: "Invalid token"
        });
    }
}