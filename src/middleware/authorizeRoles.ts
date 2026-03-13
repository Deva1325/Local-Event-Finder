import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...roles:string[])=>{

    return (req: Request, res : Response, next : NextFunction)=>{
        
        const user = (req as any).user;
     
        if (!user) {
            return res.status(401).json({
                message : "Authorization Header Missing"
            });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: "Access denied: Required roles: " + roles.join(", ") });
        }

        next();
    }
};
