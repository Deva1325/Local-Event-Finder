import { Request , Response } from "express";
import BookingModel from "../models/BookingModel";
import EventModel from "../models/EventModel";
import { successResponse,errorResponse } from "../utils/response";

export const createBooking = async (req:Request,res : Response) => {
    
    try {
        const user= (req as any).user;
        
        const { event_id,ticket_quantity } = req.body;

        if (!event_id || !ticket_quantity) {
            return errorResponse(res,"Event id and ticket quantity is required",400);
        }

        const event=await EventModel.findByPk(event_id);

        if (!event) {
            return errorResponse(res,"Event Not Found",400);
        }
        
    } catch (error) {
        
    }
}