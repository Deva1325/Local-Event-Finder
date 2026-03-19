import cron from "node-cron";
import EventModel from "../models/EventModel";
import { errorResponse } from "./response";

export const eventCron = () => {
    cron.schedule("* * * * *",async () => {
        try {
            console.log("start cron");
            
            const events=await EventModel.findAll();
            const today=new Date();

            for (const event of events) {
                const start_date=new Date(event.start_date); // converrt db date into js date for calcuate
                const end_date=new Date(event.end_date);

                if (event.status=="draft" && today>=start_date) {
                    await event.update({status : "published"});
                }

                if (event.status=="published" && today>end_date) {
                    await event.update({status : "completed"});
                }
            }
        } catch (error) {
            return errorResponse(null,"Internal server error",500);
        }
    })
}