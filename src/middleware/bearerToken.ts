import { Request,Response ,NextFunction } from "express"; 
import { ENV } from "../config/env";
import jwt from "jsonwebtoken";

export const bearerToken = async (req:Request, res : Response,next : NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                message : "Authorization header missing"
            });
        }

        const token=authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message : "Access Token missing"
            });
        }
    

        const decoded : any= jwt.verify(token,ENV.JWT_SECRET as string);
        
        (req as any).user = decoded;

        next();
    } catch (error) {
         return res.status(401).json({
            message: "Invalid or expired token"
    });

    }
}

