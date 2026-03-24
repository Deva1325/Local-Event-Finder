import { Request , Response } from "express";
import EventModel  from "../models/EventModel";
import { successResponse,errorResponse } from "../utils/response";
import { isEmpty } from "../utils/validator";
import cloudinary from "../config/cloudinary";


export const createEvent = async (req:Request,res : Response) => {
    try {

       // console.log("req body:",req.body);
        
        const user = (req as any).user;

        const { category_id,title,description,location,start_date,
            end_date,event_time,ticket_price,total_seats,booking_start_date,booking_end_date } = req.body;

        if (isEmpty(title) || isEmpty(category_id) || isEmpty(start_date) || isEmpty(ticket_price) 
            || isEmpty(total_seats) || isEmpty(booking_start_date) || isEmpty(booking_end_date)) {
            return errorResponse(res, "Required fields are missing", 400);
        }
        if (Number(total_seats)<=0) {
            return errorResponse(res,"Total seats must be greater than 0",400);
        }      
        if (Number(ticket_price) < 0) {
            return errorResponse(res, "Ticket price cannot be negative", 400);
        }

        if (new Date(end_date) < new Date(start_date)) {
            return errorResponse(res, "End date cannot be before start date", 400);
        }

        if (new Date(booking_end_date) < new Date(booking_start_date)) {
            return errorResponse(res, "Booking end date cannot be before booking start date", 400);
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
            start_date,
            end_date,
            event_time,
            ticket_price,
            total_seats,
            available_seats: total_seats,
            booking_start_date,
            booking_end_date,
            status : "draft"
        });
        return successResponse(res, "Event created successfully", event, 201);

    } catch (error) {
        console.error("create event error:", error);
        return errorResponse(res, "Internal server error");
  }
}

export const getAllEvent = async (req:Request,res:Response) => {
    try {
        
        const { category_id,sort } = req.query;
        
        let filtercategory : any = {};
        let date_order : any = [];

        if (category_id) {
            filtercategory.category_id=category_id;
        }

        if (sort=="asc") {
            date_order = [["start_date","ASC"]]
        }else if (sort=="asc") {
            date_order = [["start_date","ASC"]]
        }

        //const events = await EventModel.findAll({ where : {deleted_at : null} });
        const events = await EventModel.findAll({ where : filtercategory, order : date_order });
        
        return successResponse(res,"All Events fetched successfully!",events,200);
    } catch (error) {
        return errorResponse(res, "Internal server error",500);
    }
}

export const getEventById = async (req:Request,res:Response) =>{
    try {
        const id = Number(req.params.id);

        const event=await EventModel.findByPk(id);

        if (!event) {
            return errorResponse(res, "Event not found", 404);
        }
        
        return successResponse(res,"Event fetched successfully!",event,200);

    } catch (error) {
        return errorResponse(res, "Internal server error",500);
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

    if (event.status!=="draft") {
        return errorResponse(res, "Only draft events can be updated", 400);
    }

    const {title,description,location,image_url,start_date,end_date,event_time,ticket_price,total_seats } = req.body;
    
    let newAvailableSeats=event.available_seats;
    
        const soldTickets = event.total_seats- event.available_seats; // db value => current state
        
            //if new total_seats are updated then
            if (total_seats!==undefined) { 
         if (total_seats < soldTickets) {
        return errorResponse(res,`total_seats cannot be less than sold tickets`,400);
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
        start_date: start_date ?? event.start_date,
        end_date: end_date ?? event.end_date,
        event_time: event_time ?? event.event_time,
        ticket_price: ticket_price ?? event.ticket_price,
        total_seats: total_seats ?? event.total_seats,       
        available_seats : newAvailableSeats
    });    
        return successResponse(res, "Event updated successfully", event);

    } catch (error) {
        return errorResponse(res, "Internal server error",500);
    }
}

export const deleteEvent = async (req:Request,res:Response) => {
    try {
        const user=(req as any).user;
        const id=Number(req.params.id);

        const event= await EventModel.findByPk(id);

        if (!event) {
            return errorResponse(res,"Event Not Found",400);
        }

        if (event.organizer_id!==user.user_id) {
            return errorResponse(res,"You can only delete your own events",403);
        }

        await event.destroy();

        return successResponse(res,"Event deleted successfully",event,200);

    } catch (error) {
        console.log("event delete error");
        
        return errorResponse(res, "Internal server error",500);
    }
}

export const cancelEvent = async (req:Request,res:Response) => {
    try {
        const user=(req as any).user;
        const id=Number(req.params.id);

        const event=await EventModel.findByPk(id);

        if (!event) {
            return errorResponse(res,"Event Not Found",404);
        }

        if (event.organizer_id!==user.user_id) {
            return errorResponse(res,"You can cancel only your events",403);
        }

        const today_date=new Date();

       if (today_date>=new Date(event.start_date)) {
            return errorResponse(res,"Event already started,now cannot cancel the event",400);
        }

        await event.update({
            status : "cancelled"
        });

        return successResponse(res,"Event cancelled successfully",200);
    } catch (error) {
        return errorResponse(res, "Internal server error",500);
    }
} 