import cron from "node-cron";
import EventModel from "../models/EventModel";
import { errorResponse } from "./response";

export const eventCron = () => {
    cron.schedule("* * * * *", async () => {
        try {
            // console.log("start cron");

            const events = await EventModel.findAll();
            const today = new Date();

            for (const event of events) {
                const bookingStart = new Date(event.booking_start_date);
                const event_start_date = new Date(event.start_date); // converrt db date into js date for calcuate
                //console.log("start_date ", start_date);
                const event_end_date = new Date(event.end_date);
                //console.log("end_date ", end_date);

                if (event.status === "draft" && today >= bookingStart) {
                    await event.update({ status: "published" });
                    //console.log(" event.status ",event.status);
                }


                if (event.status === "published" && today >= event_start_date) {
                    await event.update({ status: "ongoing" });
                    //console.log(" event.status ",event.status);
                }

                if (event.status !== "completed" && today > event_end_date) {
                    await event.update({ status: 'completed' });
                }

            }
        } catch (error) {
            console.log("EventCron Error ", error);

            return errorResponse(null, "Internal server error", 500);
        }
    })
}
