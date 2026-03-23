import express from "express";
import { bearerToken } from "../middleware/bearerToken";
import {createBooking,cancelBooking,getMyBookings} from "../controllers/BookingController";

const router=express.Router();

router.post('/',bearerToken,createBooking);
router.put('/cancel',bearerToken,cancelBooking);
router.get('/mybookings',bearerToken,getMyBookings);

//console.log("Hello from booking routes");

export default router;