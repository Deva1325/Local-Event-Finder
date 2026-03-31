import { Request,Response } from "express";
import { successResponse,errorResponse } from "../utils/response";
import { EventModel } from "../models";
import BookingModel from "../models/BookingModel";
import { sequelize_db } from "../config/db";
import { Op } from "sequelize";


export const getOrganizerDashboard = async (req:Request,res:Response) => {
    try {
        const user=(req as any).user;

        if (!user) {
            return errorResponse(res,"Unauthorized User",401);
        }

        if (user.role!=='organizer') {
            return errorResponse(res,"only organizer allowed!",400);
        }

        const organizer_id = user.user_id;

        const totalEvents=await EventModel.count({ where : { organizer_id } });

        const ticketsData = await BookingModel.findOne({
            attributes: [
                [sequelize_db.fn("SUM",sequelize_db.col("ticket_quantity")),"total_tickets"]
            ],
            include:[{
                model: EventModel,
                as: "event",
                where: {organizer_id},
                attributes: []
            }],
            where: {booking_status: "confirmed"},
            raw: true
        }) as any;

        const totalRevenue = await BookingModel.findOne({
            attributes: [
                [sequelize_db.fn("SUM",sequelize_db.col("total_amount")),"total_revenue"]
            ],
            include: [{
                model: EventModel,
                as: "event",
                where: { organizer_id },
                attributes: []
            }],
            where: { booking_status : "confirmed" },
            raw: true
        }) as any;

        const today=new Date();

        const upcomingEvents = await EventModel.findAll({
            where: { 
                organizer_id,
                start_date: {
                    [Op.gte]: today
                },
                status: ["published","ongoing"]    
            },
            order: [["start_date","ASC"]]
        });

        const pastEvents = await EventModel.findAll({
            where: { 
                organizer_id,
                end_date: {
                    [Op.lt]: today
                }
            },
            order: [["start_date","DESC"]]
        });

        return successResponse(res,"Details fetched successfully!",{
            total_Events: totalEvents,
            total_Sold_Tickets: Number(ticketsData?.total_tickets || 0),
            total_revenue: Number(totalRevenue?.total_revenue || 0),
            upcoming_events: upcomingEvents,
            pastEvents: pastEvents
        });

    } catch (error) {
        console.log(error);
        
        return errorResponse(res,"Internal Server error",500);
    }
} 


// export const TotalEventByOrganizer = async (req:Request,res:Response) => {
//     try {
//         const user= (req as any).user;
//         console.log(user);
        

//         if (!user) {
//             return errorResponse(res,"Unauthorized User",401);
//         }

//         if (user.role!=='organizer') {
//             return errorResponse(res,"Only organizer allowed!",400);
//         }

//         const organizer_id = user.user_id;
//         console.log("organizer_id: ",organizer_id);
        

//         const totalEvents =await EventModel.count({ where : { organizer_id} });


//         return successResponse(res,"Events fetched successfully!",{ total_Events : totalEvents} ,200);

//     } catch (error) {
//         console.log("Organizer error ",error);
        
//         return errorResponse(res,"Internal Server Error!",500);
//     }
// }

// export const totalSoldTickets = async (req:Request,res : Response) => {
//     try {
//         const user=(req as any).user;

//         if (!user) {
//             return errorResponse(res,"Unauthorized User!",401);
//         }

//         if (user.role!=='organizer') {
//             return errorResponse(res,"only organizer allowed!",400);
//         }

//         const organizer_id=user.user_id;

//         const totalEvents=await EventModel.count({ where : { organizer_id } });

//         const ticketsData = await BookingModel.findOne({
//             attributes: [
//                 [sequelize_db.fn("SUM",sequelize_db.col("ticket_quantity")),"total_tickets"]
//             ],
//             include:[{
//                 model: EventModel,
//                 as : "event",
//                 where: { organizer_id },
//                 attributes: []
//             }],
//             where: { booking_status : 'confirmed' },
//             raw: true
//         }) as any ;
        
//         return successResponse(res,"Total Sold Tickets fetched successfully!",{
//             total_Events : totalEvents,
//             total_Sold_Tickets : Number(ticketsData?.total_tickets || 0)},200);

//     } catch (error) {
//         console.log(error);
        
//         return errorResponse(res,"Internal Server Error!",500);
//     }
// }
