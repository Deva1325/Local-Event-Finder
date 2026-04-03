import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response";

export const bearerToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return errorResponse(res, "Authorization header missing", 401);
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return errorResponse(res, "Access Token missing", 401);
        }

        const decoded: any = jwt.verify(token, ENV.JWT_SECRET as string);

        (req as any).user = decoded;

        next();
    } catch (error) {
        return errorResponse(res, "Invalid or expired token", 401);
    }
}

