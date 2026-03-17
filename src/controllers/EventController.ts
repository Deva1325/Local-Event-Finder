import { Request , Response } from "express";
import EventModel  from "../models/EventModel";
import { successResponse,errorResponse } from "../utils/response";
import { isEmpty } from "../utils/validator";

export const createEvent = async (req:Request,res : Response) => {
    try {
        const user = (req as any).user;

        const { category_id,title,image_url,description,location,
            event_date,event_time,ticket_price,total_seats } = req.body;

        if (isEmpty(title) || isEmpty(category_id) || isEmpty(event_date) || isEmpty(ticket_price) || isEmpty(total_seats) ) {
            return errorResponse(res, "Required fields are missing", 400);
        }

        if (Number(total_seats)<=0) {
            return errorResponse(res,"Total seats must be greater than 0",400);
        }
        
        if (Number(ticket_price) < 0) {
            return errorResponse(res, "Ticket price cannot be negative", 400);
        }

        const event = await EventModel.create({
            organizer_id : user.user_id,
            category_id,
            title,
            image_url,
            description,
            location,
            event_date,
            event_time,
            ticket_price,
            total_seats,
            available_seats: total_seats,
            status : "draft"
        });

        return successResponse(res, "Event created successfully", event, 201);

    } catch (error) {
        console.error("Create Event Error:", error);
        return errorResponse(res, "Internal server error");
  }
}