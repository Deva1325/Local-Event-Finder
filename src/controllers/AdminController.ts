import { Request , Response } from "express";
import { successResponse,errorResponse } from "../utils/response";
import UserModel from "../models/UserModel"
import { isNumber } from "../utils/validator";
import { BookingModel, EventModel } from "../models";
import { sequelize_db } from "../config/db";
import { logAudit } from "../utils/auditLogger";
import { sendApprovalEmail, sendRejectionEmail } from "../utils/notification";
import { ROLES,ORGANIZER_STATUS,BOOKING_STATUS } from "../constants/status";

export const handleOrganizerStatus = async (req:Request,res:Response,
    status: typeof ORGANIZER_STATUS.APPROVED | typeof ORGANIZER_STATUS.REJECTED ) => {
    
    const user_id=Number(req.params.id);

    if (!isNumber(user_id)) {
        return errorResponse(res,"Invalid User Id",400);
    }

    const adminData = (req as any).user || {};

    const user=await UserModel.findByPk(user_id);

    if (!user) {
        return errorResponse(res, "User not found", 404);
    }

    if (user.role!==ROLES.ORGANIZER) {
        return errorResponse(res, "User is not an organizer", 400);
    }

    const [updatedUser] = await UserModel.update(
        {organizer_status: status},
        { where : {
            user_id: user_id,
            organizer_status: ORGANIZER_STATUS.PENDING
        } }
    );

    if (updatedUser===0) {
        return errorResponse(res,"Organizer Already Proccessed!",400);
    }

    if (status===ORGANIZER_STATUS.APPROVED) {
        sendApprovalEmail(user.email,user.name).catch(err=> console.error("Email sending error: ",err));
    }else{
        sendRejectionEmail(user.email,user.name).catch(err=> console.error("Email sending error: ",err));
    }

    await logAudit({
        userId: adminData.user_id,
        action: status === ORGANIZER_STATUS.APPROVED ? "Approve_Organizer" : "Reject_Organizer",
        entityType: "User",
        entityId: user.user_id,
        description: `Admin ${adminData.email} ${status} organizer ${user.email}`,
        ipAddress : req.ip || null
    });

    return successResponse(res,`Organizer ${status} successfully`);
}

export const approveOrganizer = async (req: Request, res: Response) => {
    try {
        return await handleOrganizerStatus(req,res,ORGANIZER_STATUS.APPROVED);
    } catch (error) {
        console.error("Approved Organizer Error: ",error);
        return errorResponse(res,"Internal Server Error");
        
    }
}

export const rejectOrganizer = async (req:Request,res:Response) => {
    try {
        return await handleOrganizerStatus(req,res,ORGANIZER_STATUS.REJECTED);
    } catch (error) {
        console.error("Rejected Organizer Error: ",error);
        return errorResponse(res,"Interal Server Error");
    }
}

export const getAdminDashboard = async (req:Request,res:Response) => {  
    try {
        const [totalUsers,totalOrganizers,totalEvents,totalBookings,revenueData] = await Promise.all([
            UserModel.count({ where: { role: ROLES.USER } }),
            UserModel.count({ where: { role: ROLES.ORGANIZER } }),
            EventModel.count(),
            BookingModel.count({ where :  { booking_status: BOOKING_STATUS.CONFIRMED } }),
            BookingModel.findOne({
                attributes: [
                        [sequelize_db.fn("SUM",sequelize_db.col("total_amount")), "totalRevenue"]
                    ],
                    where: { booking_status : BOOKING_STATUS.CONFIRMED },
                    raw: true    
                }) as any
        ]);

        return successResponse(res,"Stats fetched successfully!",{ 
            totalUsers,
            totalOrganizers,
            totalEvents,
            totalBookings,
            totalRevenue: Number(revenueData?.totalRevenue || 0)
         })

    } catch (error) {
        console.error("Admin Dashboard Error: ",error);
        return errorResponse(res,"Internal Server Error",500); 
    }
}



// export const getAdminDashboard = async (req:Request,res:Response) => {  
//     try {
//         const user=(req as any).user;

//         if (!user) {
//             return errorResponse(res,"Unautorized user",401);
//         }

//         if (user.role!=="admin") {
//             return errorResponse(res,"Only admin allowed!",400);
//         }

//         const total_users=await UserModel.count({
//             where: { role: "user" }
//         });

//         const totalOrganizer = await UserModel.count({
//             where: { role: "organizer" }
//         });

//         const totalEvents = await EventModel.count();

//         const totalBookings = await BookingModel.count({
//             where: { booking_status: "confirmed" }
//         });

//         const revenueData = await BookingModel.findOne({
//             attributes: [
//                 [sequelize_db.fn("SUM",sequelize_db.col("total_amount")), "total_revenue"]
//             ],
//             where: { booking_status : "confirmed" },
//             raw: true    
//         }) as any;

//         return successResponse(res,"Admin records fetched successfully!",{
//             total_Users: total_users,
//             total_Organizer: totalOrganizer,
//             total_Events: totalEvents,
//             total_Bookings: totalBookings,
//             total_revenue: Number(revenueData?.total_revenue || 0)
//         });

//     } catch (error) {
//         console.error("Admin Dashboard Error: ",error);
//         errorResponse(res,"Internal Server Error",500);
//     }
// }





// export const approveOrganizer = async (req: Request, res: Response) => {
//     try {
        
//         const user_id = Number(req.params.id);

//         if (!isNumber(user_id)) {
//             return errorResponse(res,"Invalid User Id",400);
//         }

//         const adminData = (req as any).user;

//         const user=await UserModel.findByPk(user_id);

//         if (!user) {
//             return errorResponse(res, "User not found", 404);
//         }

//         if (user.role!=="organizer") {
//             return errorResponse(res, "User is not an organizer", 400);
//         }

//         if (user.organizer_status!=="pending") {
//             return errorResponse(res,"Organizer already processed",400);
//         }

//         await user.update({
//            organizer_status : "approved" 
//         });

//         await sendApprovalEmail(user.email,user.name);

//         await logAudit({
//               user_id:  adminData.user_id,
//               action: "Approve_Organizer",
//               entity_type: "User",
//               entity_id: user.user_id,
//               description: `Admin ${adminData.email} approved organizer ${user.email}`,
//               ip_address: req.ip || null
//             });

//         return successResponse(res, "Organizer approved successfully");

//         } catch (error) {
//             return errorResponse(res, "Internal server error");
//         }
// }

// export const rejectOrganizer = async (req:Request,res:Response) => {
//     try {
//         const user_id=Number(req.params.id);

//         if (!isNumber(user_id)) {
//             return errorResponse(res,"Invalid User id",400);
//         }

//         const adminData=(req as any).user;

//         const user=await UserModel.findByPk(user_id);

//         if (!user) {
//             return errorResponse(res,"User not found",404);
//         }        

//         if (user.role!=="organizer") {
//             return errorResponse(res,"user is not organizer",400);
//         }

//         if (user.organizer_status!=="pending") {
//             return errorResponse(res,"Organizer already processed",400);
//         }

//         await user.update({
//             organizer_status : "rejected"
//         });

//         await sendRejectionEmail(user.email,user.name);

//         await logAudit({
//             user_id:  adminData.user_id,
//             action: "Reject_Organizer",
//             entity_type: "User",
//             entity_id: user.user_id,
//             description: `Admin ${adminData.email} rejected organizer ${user.email}`,
//             ip_address: req.ip || null
//         });

//         return successResponse(res,"Organizer rejected successfully",200);
//     } catch (error) {
//         return errorResponse(res,"Internal Server Error",500);
//     }
// }
