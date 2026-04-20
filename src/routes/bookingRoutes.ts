import express from "express";
import { bearerToken } from "../middleware/bearerToken";
import { createBooking, cancelBooking, getMyBookings, getBookingsByEvent } from "../controllers/BookingController";
import { authorizeRoles } from "../middleware/authorizeRoles";

const router = express.Router();

router.post('/', bearerToken, createBooking);
router.put('/cancel/:id', bearerToken, cancelBooking);
router.get('/mybookings', bearerToken, getMyBookings);

router.get('/event/:event_id',bearerToken,authorizeRoles("organizer"),getBookingsByEvent);
//console.log("Hello from booking routes");

export default router;