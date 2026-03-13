import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";


export const adminBearerToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization Header Missing"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access Token Missing"
            });
        }

        const decoded: any = jwt.verify(token, ENV.JWT_SECRET as string);

        if (decoded.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admins only."
            });
        }

        (req as any).user = decoded;

        next();


    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
}