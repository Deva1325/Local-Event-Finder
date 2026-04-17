import express from "express";
import { createReview, getReviewsByEvent, updateReview, deleteReview } from "../controllers/ReviewController";
import { bearerToken } from "../middleware/bearerToken";

const router = express.Router();

router.post('/', bearerToken, createReview);
router.put('/:review_id', bearerToken, updateReview);

router.get('/event/:event_id', getReviewsByEvent);

router.delete('/:review_id', bearerToken, deleteReview);


export default router;