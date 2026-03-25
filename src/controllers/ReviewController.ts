import {Request,Response} from "express";
import { successResponse,errorResponse } from "../utils/response";
import ReviewModel  from "../models/ReviewModel";
import EventModel  from "../models/EventModel";
import { isEmpty,isNumber } from "../utils/validator";

export const createReview = async (req:Request,res:Response) => {
    try {
        
        const user = (req as any).user;
        const user_id=user.user_id; 

        if (!user) {
            return errorResponse(res,"User not authorized",401);
        }
        const {event_id,rating,review_text}=req.body;

        if (isEmpty(event_id) || isEmpty(rating) ) {
            return errorResponse(res,"Event and rating are required!",400);
        }

        if (rating<1 || rating>5) {
            return errorResponse(res,"Rating must be between 1  to 5",400);
        }
        
        const event= await EventModel.findByPk(event_id);
        
        if (!event) {
            return errorResponse(res,"Event Not Found",400);
        }

        const existingReview = await ReviewModel.findOne({ where : { user_id,event_id } });

        if (existingReview) {
            return errorResponse(res,"You already reviewed the event",400);
        }

        const review=await ReviewModel.create({
            user_id,
            event_id,
            rating,
            review_text
        });

        return successResponse(res,"Review added succesfully!",review,201);

    } catch (error) {
        //console.log("Review debug error",error);
        
        return errorResponse(res,"Internal server error",500);
    }
}

export const getReviewsByEvent=async (req:Request,res:Response) => {
    try {
        const event_id=Number(req.params.event_id);

        if (!isNumber(event_id)) {
            return errorResponse(res,"Invalid event id",400);
        }

        const event=await EventModel.findByPk(event_id);

        if (!event) {
            return errorResponse(res,"Event Not Found",400);
        }

        const reviews = await ReviewModel.findAll({ 
            where : { event_id },   
            order: [["created_at","DESC"]]
        });

        return successResponse(res,"Reviews fetched successfully",reviews,200);
    } catch (error) {   
        console.log("get event error",error);
        
        return errorResponse(res,"Internal server error",500);       
    }
}

export const updateReview = async (req:Request,res:Response) => {
    try {
        const user=(req as any).user;
        const user_id=user.user_id;

        const review_id=Number(req.params.review_id);

        if (!isNumber(review_id)) {
            return errorResponse(res,"Invalid review id",400);
        }

        const { rating,review_text }=req.body;

        const review=await ReviewModel.findOne({ where : { review_id,user_id} });

        if (!review) {
            return errorResponse(res,"Review Not Found",400);
        }

        await review.update({
           rating,
           review_text 
        });

        return successResponse(res,"Review updated successfully!",review,200);
    } catch (error) {
        console.log("Update review error",error);
        return errorResponse(res,"Internal server error",500);
    }
}

export const deleteReview = async (req:Request,res:Response) => {
    try {
        const user = (req as any).user;
        const user_id=user.user_id;

        const review_id=Number(req.params.review_id);

        if (!isNumber(review_id)) {
            return errorResponse(res,"Invalid review id",400);
        }

        const review=await ReviewModel.findOne({ where : { review_id, user_id} });

        if (!review) {
            return errorResponse(res,"Review not found",400);
        }

        await review.destroy();

        return successResponse(res,"Review deleted successfully",200);

    } catch (error) {
        console.log(error);
        return errorResponse(res,"Internal server error",500);
    }
}