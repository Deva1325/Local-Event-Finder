import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response";
import { AuthRequest } from "../types/AuthRequest";

export const bearerToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
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

        //(req as any).user = decoded;

        req.user= decoded as any;

        next();
    } catch (error) {
        return errorResponse(res, "Invalid or expired token", 401);
    }
}

