import { Request, Response } from "express";
import EventModel from "../models/EventModel";
import { successResponse, errorResponse } from "../utils/response";
import { isEmpty } from "../utils/validator";
import cloudinary from "../config/cloudinary";
import { ReviewModel } from "../models";
import { sequelize_db } from "../config/db";
import { logAudit } from "../utils/auditLogger";
import fs from 'fs';

export const createEvent = async (req: Request, res: Response) => {
    try {

        // console.log("req body:",req.body);

        const user = (req as any).user;

        const { category_id, title, description, location, start_date,
            end_date, event_time, ticket_price, total_seats, booking_start_date, booking_end_date } = req.body;

        const price = Number(ticket_price);
        const seats = Number(total_seats);


        if (isEmpty(title) || isEmpty(category_id) || isEmpty(start_date) || isEmpty(ticket_price) || isEmpty(event_time)
            || isEmpty(total_seats) || isEmpty(booking_start_date) || isEmpty(booking_end_date)) {
            return errorResponse(res, "Required fields are missing", 400);
        }
        if (seats <= 0) {
            return errorResponse(res, "Total seats must be greater than 0", 400);
        }
        if (price < 0) {
            return errorResponse(res, "Ticket price cannot be negative", 400);
        }

        if (new Date(booking_end_date) > new Date(start_date)) {
            return errorResponse(res, "Booking end e cannot be after event start", 400);
        }

        if (new Date(end_date) < new Date(start_date)) {
            return errorResponse(res, "End date cannot be before start date", 400);
        }

        if (new Date(booking_end_date) < new Date(booking_start_date)) {
            return errorResponse(res, "Booking end date cannot be before booking start date", 400);
        }

        let image_url = null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "local_events_demo" });
            image_url = result.secure_url; // the real https:// 
            //console.log("image_url:", image_url);

            //fs.unlinkSync(req.file.path);
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error while deleing local temp file: ", err);
            });
        }

        const event = await EventModel.create({
            organizer_id: user.user_id,
            category_id,
            title,
            image_url,
            description,
            location,
            start_date,
            end_date,
            event_time,
            ticket_price: price,
            total_seats: seats,
            available_seats: seats,
            booking_start_date,
            booking_end_date,
            status: "draft"
        });

        await logAudit({
            userId: user.user_id,
            action: "Event_Created",
            entityType: "Event",
            entityId: event.event_id,
            description: `Organizer created a new event: ${event.title}`,
            ipAddress: req.ip || null
        });

        return successResponse(res, "Event created successfully", event, 201);

    } catch (error) {
        console.error("create event error:", error);
        return errorResponse(res, "Internal server error");
    }
}

export const getAllEvent = async (req: Request, res: Response) => {
    try {

        const { category_id, sort, status, page, limit } = req.query;

        const pageNumber = Number(page) || 1;
        const pageSize = Number(limit) || 10;
        const offset = (pageNumber - 1) * pageSize;

        let filterCategory: any = {};

        if (category_id) {
            filterCategory.category_id = category_id;
        }

        if (status) {
            filterCategory.status = status;
        }

        //let filtercategory: any = {};
        let order: any = [];

        if (sort == "asc") {
            order = [["start_date", "ASC"]]
        } else if (sort == "desc") {
            order = [["start_date", "DESC"]]
        }

        //const events = await EventModel.findAll({ where : {deleted_at : null} });
        const events = await EventModel.findAll({
            where: filterCategory,
            order: order,
            limit: pageSize,
            offset: offset
        });

        return successResponse(res, "All Events fetched successfully!", events, 200);
    } catch (error) {
        return errorResponse(res, "Internal server error", 500);
    }
}

export const getEventById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const event = await EventModel.findByPk(id);

        if (!event) {
            return errorResponse(res, "Event not found", 404);
        }
        // const avg = await ReviewModel.findOne({
        //     attributes: [
        //         [sequelize_db.fn("AVG", sequelize_db.col("rating")), "avg_rating"]
        //     ],
        //     where: { event_id: id },
        //     raw: true
        //     // plain json data 
        // }) as any;

        // const totalReviews = await ReviewModel.count({ where: { event_id: id } });

        const reviewStats = await ReviewModel.findOne({
            attributes: [
                [sequelize_db.fn("AVG", sequelize_db.col("rating")), "avg_rating"],
                [sequelize_db.fn("COUNT", sequelize_db.col("review_id")), "total_reviews"]
            ],
            where: { event_id: id },
            raw: true
        }) as any;

        const avgRating = Number(reviewStats?.avg_rating || 0);
        const totalReviews = Number(reviewStats?.total_reviews || 0);

        return successResponse(res, "Event fetched successfully", {
            ...event.toJSON(),
            average_rating: Number(avgRating.toFixed(1)),
            totalReviews
        });

    } catch (error) {
        return errorResponse(res, "Internal server error", 500);
    }
}

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const eventId = Number(req.params.id);

        const event = await EventModel.findByPk(eventId);

        if (!event) {
            return errorResponse(res, "Event not found", 404);
        }
        //check for valid organizer
        if (event.organizer_id !== user.user_id) {
            return errorResponse(res, "You can only update your own events", 403);
        }

        if (event.status !== "draft") {
            return errorResponse(res, "Only draft events can be updated", 400);
        }

        const { title, description, location, start_date, end_date, event_time, ticket_price, total_seats } = req.body;

        const price = ticket_price !== undefined ? Number(ticket_price) : undefined;
        const seats=total_seats!==undefined? Number(total_seats) : undefined;

        let newAvailableSeats = event.available_seats;

        const soldTickets = event.total_seats - event.available_seats; // db value => current state

        if (price!==undefined && price<0) {
            return errorResponse(res,"Ticket Price cannot be negative",400);
        }

        if (seats!=undefined && seats<=0) {
            return errorResponse(res,"Total seats must be greater than 0",400);
        }

        //if new total_seats are updated then
        if (seats!==undefined) {
            if (seats<soldTickets) {
                return errorResponse(res, `total_seats cannot be less than sold tickets`, 400);
            }
            newAvailableSeats=seats-soldTickets;
        }
    
        let updateimg = event.image_url;

        if (req.file) {

            if (event.image_url) {
                const publicId= event.image_url.split("/").pop()?.split(".")[0]; 
                // extract public_id from URL

                if (publicId) {
                    await cloudinary.uploader.destroy(`local_events_demo/${publicId}`);
                }
            }

            const result = await cloudinary.uploader.upload(req.file.path, { 
                folder: "local_events_demo" });
            updateimg = result.secure_url;
        
            fs.unlinkSync(req.file.path);
        }

        await event.update({
            title: title ?? event.title,
            description: description ?? event.description,
            location: location ?? event.location,
            image_url: updateimg,
            start_date: start_date ?? event.start_date,
            end_date: end_date ?? event.end_date,
            event_time: event_time ?? event.event_time,
            ticket_price: price ?? event.ticket_price,
            total_seats: seats ?? event.total_seats,
            available_seats: newAvailableSeats
        });

        await logAudit({
            userId: user.user_id,
            action: "Event_Updated",
            entityType: "Event",
            entityId: event.event_id,
            description: `Organizer updated event details for: ${event.title}`,
            ipAddress: req.ip || null
        });

        return successResponse(res, "Event updated successfully", event);

    } catch (error) {
        return errorResponse(res, "Internal server error", 500);
    }
}

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const id = Number(req.params.id);

        const event = await EventModel.findByPk(id);

        if (!event) {
            return errorResponse(res, "Event Not Found", 400);
        }

        if (event.organizer_id !== user.user_id) {
            return errorResponse(res, "You can only delete your own events", 403);
        }

        await event.destroy();

        await logAudit({
            userId: user.user_id,
            action: "Event_Deleted",
            entityType: "Event",
            entityId: event.event_id,
            description: `Organizer deleted event: ${event.title}`,
            ipAddress: req.ip || null
        });

        return successResponse(res, "Event deleted successfully");

    } catch (error) {
        console.log("event delete error");

        return errorResponse(res, "Internal server error", 500);
    }
}

export const cancelEvent = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const id = Number(req.params.id);

        const event = await EventModel.findByPk(id);

        if (!event) {
            return errorResponse(res, "Event Not Found", 404);
        }

        if (event.organizer_id !== user.user_id) {
            return errorResponse(res, "You can cancel only your events", 403);
        }

        const today_date = new Date();

        if (today_date >= new Date(event.start_date)) {
            return errorResponse(res, "Event already started,now cannot cancel the event", 400);
        }

        await event.update({
            status: "cancelled"
        });

        await logAudit({
            userId: user.user_id,
            action: "Event_Cancelled",
            entityType: "Event",
            entityId: event.event_id,
            description: `Organizer cancelled event: ${event.title}`,
            ipAddress: req.ip || null
        });

        return successResponse(res, "Event cancelled successfully");
    } catch (error) {
        return errorResponse(res, "Internal server error", 500);
    }
} 