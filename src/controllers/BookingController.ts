import { Request , Response } from "express";
import BookingModel from "../models/BookingModel";
import EventModel from "../models/EventModel";
import { successResponse,errorResponse } from "../utils/response";
import { sequelize_db } from "../config/db";

export const createBooking = async (req:Request,res : Response) => {
    
    let transaction;
    try {
        const user = (req as any).user;
        
        if (!user) {
            return errorResponse(res,"User not authorized",403);
        }

        const { event_id,ticket_quantity } = req.body;

        if (!event_id || !ticket_quantity) {
            return errorResponse(res,"Event id and ticket quantity is required",400);
        }

        transaction = await sequelize_db.transaction();

        const event=await EventModel.findByPk(event_id, {transaction , lock : true});

        if (!event) {
            return errorResponse(res,"Event Not Found",400);
        }

        if (event.status!=='published') {
            return errorResponse(res,"Booking allow only for published events",400);
        }

        if (event.available_seats<ticket_quantity) {
            return errorResponse(res,"No enough seats available",400);
        }

        const total_amt=event.ticket_price*ticket_quantity;
        console.log("total_amt: ",total_amt);
        
        const booking=await BookingModel.create({
            user_id: user.user_id,
            event_id,
            ticket_quantity,
            total_amount: total_amt,
        }, { transaction }
    );

        const newAvailSeats=event.available_seats-ticket_quantity;

        await event.update({
            available_seats:newAvailSeats
        }, { transaction });

        await transaction.commit();
        return successResponse(res,"Event booked successfully",booking,201);

    } catch (error) {
        if(transaction)
            await transaction.rollback();
        return errorResponse(res,"Internal Server Error",500);
    }
}

export const cancelBooking = async (req:Request,res: Response) => {

    let transaction;
    try {
        const user=(req as any).user;
        const booking_id=Number(req.params.id);

        transaction=await sequelize_db.transaction();

        const booking=await BookingModel.findByPk(booking_id, {transaction});

        if (!booking) {
            await transaction.rollback();
            return errorResponse(res,"Booking Not Found",400);
        }

        if (booking.user_id!==user.user_id) {
            await transaction.rollback();
            return errorResponse(res,"Not valid user",403);
        }

        if (booking.booking_status==="cancelled") {
            await transaction.rollback();
            return errorResponse(res,"Booking is already cancelled",400);
        }
        await booking.update({
            booking_status : "cancelled",
        }, { transaction });

        const event=await EventModel.findByPk(booking.event_id,{transaction});

        await event?.update({
            available_seats: event.available_seats + booking.ticket_quantity
        }, { transaction });

        await transaction.commit();

        return successResponse(res,"Event cancelled successfully!",booking,200);

    } catch (error) {
        if (transaction) await transaction.rollback();
        return errorResponse(res,"Internal server error",500);
    }
}       

export const getMyBookings = async (req:Request,res:Response) => {
    try {
        const user=(req as any).user;
        //console.log();
        
        const mybookings=await BookingModel.findAll({ where : { user_id : user.user_id }});
        console.log("mybookings: ",mybookings);
        
        if (!mybookings) {
            return errorResponse(res,"User not found",400);
        }

        return successResponse(res,"Booking fetched successfully",mybookings,200);
    } catch (error) {
        return errorResponse(res,"Internal Server Error",500);
    }
}