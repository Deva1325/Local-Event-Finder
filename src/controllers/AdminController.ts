import { Request , Response } from "express";
import { successResponse,errorResponse } from "../utils/response";
import UserModel from "../models/UserModel"

export const approveOrganizer = async (req: Request, res: Response) => {
    try {
        
        const user_id = Number(req.params.id);
        const user=await UserModel.findByPk(user_id);

        if (!user) {
            return errorResponse(res, "User not found", 404);
        }

        if (user.role!=="organizer") {
            return errorResponse(res, "User is not an organizer", 400);
        }

        await user.update({
           organizer_status : "approved" 
        });

        return successResponse(res, "Organizer approved successfully");

        } catch (error) {
            return errorResponse(res, "Internal server error");
        }
}