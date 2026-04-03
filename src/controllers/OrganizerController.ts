import { Request,Response } from "express";
import { successResponse,errorResponse } from "../utils/response";
import { EventModel } from "../models";
import BookingModel from "../models/BookingModel";
import { sequelize_db } from "../config/db";
import { Op } from "sequelize";


export const getOrganizerDashboard = async (req:Request,res:Response) => {
    try {
        const user=(req as any).user;

        if (!user || user.role!=='organizer') {
            return errorResponse(res,"Unauthorized Access",401);
        }

        const organizer_id = user.user_id;

        const totalEvents=await EventModel.count({ where : { organizer_id } });

        const stats=await BookingModel.findOne({
            attributes: [
                [sequelize_db.fn("SUM",sequelize_db.col("ticket_quantity")),"total_tickets"],
                [sequelize_db.fn("SUM",sequelize_db.col("total_amount")),"total_revenue"]
            ],
            include:[{
                model: EventModel,
                as: "event",
                where: {organizer_id},
                attributes:[]
            }],
            where: {booking_status: "confirmed"},
            raw: true  
        }) as any;

        const today=new Date();
        today.setHours(0,0,0,0);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const offset = (page - 1)* limit;

        const upcomingEvents = await EventModel.findAll({
            where: { 
                organizer_id,
                start_date: { [ Op.gte ]: today },
                status: { [Op.in] : ["published","ongoing"]}
            },
            order: [["start_date","ASC"]],
            limit,
            offset
        });

        const pastEvents = await EventModel.findAll({
            where: { 
                organizer_id,
                end_date: { [Op.lt]: today },
                status: { [Op.in]: ["completed","cancelled"]  }
            },
            order: [["start_date","DESC"]],
            limit,
            offset
        });

        return successResponse(res,"Dashboard fetched successfully!",{
            totalEvents: totalEvents,
            totalSoldTickets: Number(stats?.total_tickets || 0),
            totalRevenue: Number(stats?.total_revenue || 0),
            upcomingEvents: upcomingEvents,
            pastEvents: pastEvents
        });

    } catch (error) {
        console.log(error);
        
        return errorResponse(res,"Internal Server error",500);
    }
} 
