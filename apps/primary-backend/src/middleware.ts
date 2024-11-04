import { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as unknown as string;

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
        //@ts-ignore
        req.id = payload.id;
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({
            message: "Your are not loged in"
        })
    }

}