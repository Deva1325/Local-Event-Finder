import { Request , Response } from "express";
import { successResponse,errorResponse } from "../utils/response";
import UserModel from "../models/UserModel"
import { isNumber } from "../utils/validator";

export const approveOrganizer = async (req: Request, res: Response) => {
    try {
        
        const user_id = Number(req.params.id);

        if (!isNumber(user_id)) {
            return errorResponse(res,"Invalid User Id",400);
        }

        const user=await UserModel.findByPk(user_id);

        if (!user) {
            return errorResponse(res, "User not found", 404);
        }

        if (user.role!=="organizer") {
            return errorResponse(res, "User is not an organizer", 400);
        }

        if (user.organizer_status!=="pending") {
            return errorResponse(res,"Organizer already processed",400);
        }

        await user.update({
           organizer_status : "approved" 
        });

        return successResponse(res, "Organizer approved successfully");

        } catch (error) {
            return errorResponse(res, "Internal server error");
        }
}

export const rejectOrganizer = async (req:Request,res:Response) => {
    try {
        const user_id=Number(req.params.id);

        if (!isNumber(user_id)) {
            return errorResponse(res,"Invalid User id",400);
        }
        const user=await UserModel.findByPk(user_id);

        if (!user) {
            return errorResponse(res,"User not found",404);
        }        

        if (user.role!=="organizer") {
            return errorResponse(res,"user is not organizer",400);
        }

        if (user.organizer_status!=="pending") {
            return errorResponse(res,"Organizer already processed",400);
        }

        await user.update({
            organizer_status : "rejected"
        });

        return successResponse(res,"Organizer rejected successfully",200);
    } catch (error) {
        return errorResponse(res,"Internal Server Error",500);
    }
}

