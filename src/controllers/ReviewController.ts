import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import ReviewModel from "../models/ReviewModel";
import EventModel from "../models/EventModel";
import { isEmpty, isNumber } from "../utils/validator";
import BookingModel from "../models/BookingModel";
import UserModel from "../models/UserModel";
import { logAudit } from "../utils/auditLogger";

export const createReview = async (req: Request, res: Response) => {
    try {

        const user = (req as any).user;

        if (!user) {
            return errorResponse(res, "User not authorized", 401);
        }

        const user_id = user.user_id;
        const { event_id, rating, review_text } = req.body;

        if (isEmpty(event_id) || isEmpty(rating)) {
            return errorResponse(res, "Event and rating are required!", 400);
        }

        if (!isNumber(rating)) {
            return errorResponse(res, "Rating must be a number", 400);
        }

        const ratingValue = Number(rating);

        if (ratingValue < 1 || ratingValue > 5) {
            return errorResponse(res, "Rating must be between 1  to 5", 400);
        }

        const event = await EventModel.findByPk(event_id);

        if (!event) {
            return errorResponse(res, "Event Not Found", 404);
        }

        if (event.status !== "ongoing" && event.status !== "completed") {
            return errorResponse(res, "You can review only ongoing and completed events", 400);
        }

        const userBooking = await BookingModel.findOne({
            where: { user_id, event_id, booking_status: "confirmed" }
        });

        if (!userBooking) {
            return errorResponse(res, "You cannot give review without attending the event", 400);
        }

        const existingReview = await ReviewModel.findOne({ where: { user_id, event_id } });

        if (existingReview) {
            return errorResponse(res, "You already reviewed the event", 400);
        }

        const review = await ReviewModel.create({
            user_id,
            event_id,
            rating: ratingValue,
            review_text
        });

        await logAudit({
            userId: user.user_id,
            action: "Review_Created",
            entityType: "Review",
            entityId: review.review_id,
            description: `User added a ${rating}-star review for Event ID: ${event_id}`,
            ipAddress: req.ip || null
        });

        return successResponse(res, "Review added successfully", review, 201);

    } catch (error) {
        //console.log("Review debug error",error);

        return errorResponse(res, "Internal server error", 500);
    }
}

export const getReviewsByEvent = async (req: Request, res: Response) => {
    try {
        const event_id = Number(req.params.event_id);

        if (!isNumber(event_id)) {
            return errorResponse(res, "Invalid event id", 400);
        }

        const event = await EventModel.findByPk(event_id);

        if (!event) {
            return errorResponse(res, "Event Not Found", 404);
        }

        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const offset = (page - 1) * limit;

        const reviews = await ReviewModel.findAll({
            where: { event_id },
            include: [{
                model: UserModel,
                as: "user",
                attributes: ["user_id", "name", "email"]
            }],
            order: [["created_at", "DESC"]],
            limit, offset
        });

        return successResponse(res, "Reviews fetched successfully", reviews, 200);
    } catch (error) {
        console.log("get event error", error);

        return errorResponse(res, "Internal server error", 500);
    }
}

export const updateReview = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const user_id = user.user_id;

        const review_id = Number(req.params.review_id);

        if (!isNumber(review_id)) {
            return errorResponse(res, "Invalid review id", 400);
        }

        const { rating, review_text } = req.body;

        const review = await ReviewModel.findOne({ where: { review_id, user_id } });

        if (!review) {
            return errorResponse(res, "Review Not Found", 404);
        }

        if (rating === undefined && isEmpty(review_text)) {
            return errorResponse(res, "Nothing to update", 400);
        }

        let ratingValue;
        if (rating != undefined) {
            if (!isNumber(rating)) {
                return errorResponse(res, "Rating must be a number", 400);
            }

            ratingValue=Number(rating);

            if (rating < 1 || rating > 5) {
                return errorResponse(res, "Rating must be between 1 to 5", 400);
            }
        }

        await review.update({
            rating: ratingValue?? review.rating,
            review_text
        });

        await logAudit({
            userId: user.user_id,
            action: "Review_Updated",
            entityType: "Review",
            entityId: review.review_id,
            description: `User updated a ${rating}-star review for Event ID: ${review.event_id}`,
            ipAddress: req.ip || null
        });

        return successResponse(res, "Review updated successfully!", review, 200);
    } catch (error) {
        console.log("Update review error", error);
        return errorResponse(res, "Internal server error", 500);
    }
}

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const user_id = user.user_id;

        const review_id = Number(req.params.review_id);

        if (!isNumber(review_id)) {
            return errorResponse(res, "Invalid review id", 400);
        }

        const review = await ReviewModel.findOne({ where: { review_id, user_id } });

        if (!review) {
            return errorResponse(res, "Review not found", 404);
        }

        await review.destroy();

        await logAudit({
            userId: user.user_id,
            action: "Review_Deleted",
            entityType: "Review",
            entityId: review.review_id,
            description: `User deleted a review for Event ID: ${review.event_id}`,
            ipAddress: req.ip || null
        });

        return successResponse(res, "Review deleted successfully");

    } catch (error) {
        console.log(error);
        return errorResponse(res, "Internal server error", 500);
    }
}   