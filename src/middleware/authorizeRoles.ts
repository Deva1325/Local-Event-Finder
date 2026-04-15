import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response";
import { AuthRequest } from "../types/AuthRequest";

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {

        //const user = (req as any).user;
        const user=req.user;

        if (!user) {
            return errorResponse(res, "User not authorized", 401);
        }

        if (!roles.includes(user.role)) {
            return errorResponse(res, `Access denied, only ${roles.join(",")} can access this resource`, 403);
        }

        if (roles.includes("organizer") && user.organizer_status !== "approved") {
            return errorResponse(res, "Organizer request is not approved by admin", 403);
        }

        //console.log("User from token:", user);
        next();


    }
};
