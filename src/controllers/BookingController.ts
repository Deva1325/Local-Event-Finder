import { Request, Response } from "express";
import BookingModel from "../models/BookingModel";
import EventModel from "../models/EventModel";
import { successResponse, errorResponse } from "../utils/response";
import { sequelize_db } from "../config/db";
import { isEmpty, isNumber } from "../utils/validator";
import { logAudit } from "../utils/auditLogger";
import { BOOKING_STATUS, EVENT_STATUS } from "../constants/status";

export const createBooking = async (req: Request, res: Response) => {

    let transaction;
    try {
        const user = (req as any).user;

        if (!user) {
            return errorResponse(res, "User not authorized", 403);
        }

        const { event_id, ticket_quantity } = req.body;

        if ((isEmpty(event_id) || isEmpty(ticket_quantity))) {
            return errorResponse(res, "Event id and ticket quantity is required", 400);
        }

        if (!isNumber(ticket_quantity) || ticket_quantity < 0) {
            return errorResponse(res, "Ticket quantity must be a positive number", 400);
        }

        transaction = await sequelize_db.transaction();

        const event = await EventModel.findByPk(event_id, { transaction, lock: true });

        if (!event) {
            return errorResponse(res, "Event Not Found", 400);
        }

        const today = new Date();
        const bookingStart = new Date(event.booking_start_date);
        const bookingEnd = new Date(event.booking_end_date);

        if (today < bookingStart) {
            await transaction.rollback();
            return errorResponse(res, "Booking is not started yet", 400);
        }

        if (today > bookingEnd) {
            await transaction.rollback();
            return errorResponse(res, "Booking is closed for the event", 400);
        }

        if (event.status !== EVENT_STATUS.PUBLISHED && event.status !== EVENT_STATUS.ONGOING) {
            await transaction.rollback();
            return errorResponse(res, "Booking allow only for published or ongoing events", 400);
        }

        if (event.available_seats < ticket_quantity) {
            await transaction.rollback();
            return errorResponse(res, "Not enough seats available", 400);
        }

        const total_amt = event.ticket_price * ticket_quantity;
        console.log("total_amt: ", total_amt);

        const booking = await BookingModel.create({
            user_id: user.user_id,
            event_id,
            ticket_quantity,
            total_amount: total_amt,
        }, { transaction }
        );

        const newAvailSeats = event.available_seats - ticket_quantity;

        if (newAvailSeats < 0) {
            await transaction.rollback();
            return errorResponse(res, "No enough seats available", 400);
        }

        await event.update({
            available_seats: newAvailSeats
        }, { transaction });

        await transaction.commit();

        await logAudit({
            userId: user.user_id,
            action: "Booking_Created",
            entityType: "Booking",
            entityId: booking.booking_id,
            description: `User booked ${ticket_quantity} tickets for Event ID: ${event_id}`,
            ipAddress: req.ip || null
        });

        return successResponse(res, "Event booked successfully", booking, 201);

    } catch (error) {
        if (transaction)
            await transaction.rollback();
        console.error("Create Booking Error: ", error);
        return errorResponse(res, "Internal Server Error", 500);
    }
}

export const cancelBooking = async (req: Request, res: Response) => {

    let transaction;
    try {
        const user = (req as any).user;
        //console.log("user: ",user);

        if (!user) {
            return errorResponse(res, "User not authorized", 403);
        }

        const booking_id = Number(req.params.id);

        transaction = await sequelize_db.transaction();

        const booking = await BookingModel.findByPk(booking_id, { transaction });
        //console.log("booking ",booking);


        if (!booking) {
            await transaction.rollback();
            return errorResponse(res, "Booking Not Found", 400);
        }

        if (booking.user_id !== user.user_id) {
            await transaction.rollback();
            return errorResponse(res, "Not valid user", 403);
        }

        if (booking.booking_status === BOOKING_STATUS.CANCELLED) {
            await transaction.rollback();
            return errorResponse(res, "Booking is already cancelled", 400);
        }
        await booking.update({
            booking_status: BOOKING_STATUS.CANCELLED,
        }, { transaction });

        const event = await EventModel.findByPk(booking.event_id, { transaction });

        if (!event) {
            await transaction.rollback();
            return errorResponse(res, "Event not found", 404);
        }

        await event.update({
            available_seats: event.available_seats + booking.ticket_quantity
        }, { transaction });

        await transaction.commit();

        await logAudit({
            userId: user.user_id,
            action: "Booking_Cancelled",
            entityType: "Booking",
            entityId: booking.booking_id,
            description: `User cancelled booking for Event ID: ${booking.event_id}`,
            ipAddress: req.ip || null
        });

        return successResponse(res, "Event cancelled successfully!", booking, 200);

    } catch (error) {
        if (transaction) await transaction.rollback();
        return errorResponse(res, "Internal server error", 500);
    }
}

export const getMyBookings = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        //console.log(user);

        const mybookings = await BookingModel.findAll({
            where: { user_id: user.user_id },
            order: [['created_at', 'DESC']]
        });
        //console.log("mybookings: ",mybookings);

        return successResponse(res, "Booking fetched successfully", mybookings, 200);
    } catch (error) {
        console.log("Get my bookings error: ", error);

        return errorResponse(res, "Internal Server Error", 500);
    }
}
