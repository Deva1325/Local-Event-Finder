import { Request , Response } from "express";
import EventModel  from "../models/EventModel";
import { successResponse,errorResponse } from "../utils/response";
import { isEmpty } from "../utils/validator";
import cloudinary from "../config/cloudinary";


export const createEvent = async (req:Request,res : Response) => {
    try {

       // console.log("req body:",req.body);
        
        const user = (req as any).user;

        const { category_id,title,description,location,
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

        let image_url=null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {folder: "local_events_demo" });
            image_url = result.secure_url; // the real https:// 
            //console.log("image_url:", image_url);
            
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
        console.error("create event error:", error);
        return errorResponse(res, "Internal server error");
  }
}

export const updateEvent = async (req:Request,res : Response) => {
    try {
    const user = (req as any).user;
    const eventId = Number(req.params.id);   

    const event = await EventModel.findByPk(eventId);
    
    if (!event) {
        return errorResponse(res, "Event not found", 404);
    }
    //check for valid organizer
    if (event.organizer_id!==user.user_id) {
        return errorResponse(res,"You can only update your own events",403);
    }

    //only draft can be updated
    if (event.status!=="draft") {
        return errorResponse(res, "Only draft events can be updated", 400);
    }

    const {title,description,location,image_url,event_date,event_time,ticket_price,total_seats } = req.body;
    
    let newAvailableSeats=event.available_seats;
    
        const soldTickets = event.total_seats- event.available_seats; // db value => current state
        
            //if new total_seats are updated then
            if (total_seats!==undefined) { 
         if (total_seats < soldTickets) {
        return errorResponse(res,`total_seats cannot be less than sold tickets (${soldTickets})`,400);
        }   
        newAvailableSeats=total_seats-soldTickets; 
    }

    let updateimg=event.image_url;

    if (req.file) {
        const result=await cloudinary.uploader.upload(req.file.path,{ folder : "local_events_demo" });
        updateimg=result.secure_url;
    }

    await event.update({
        title : title ?? event.title,
        description: description ?? event.description,
        location: location ?? event.location,
        image_url: updateimg,
        event_date: event_date ?? event.event_date,
        event_time: event_time ?? event.event_time,
        ticket_price: ticket_price ?? event.ticket_price,
        total_seats: total_seats ?? event.total_seats,       
        available_seats : newAvailableSeats
    });    
        return successResponse(res, "Event updated successfully", event);

    } catch (error) {
        console.error("update eventerror:", error);
        return errorResponse(res, "Internal server error");
    }
}