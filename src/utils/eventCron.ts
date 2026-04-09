import cron from "node-cron";
import EventModel from "../models/EventModel";
import { Op } from 'sequelize';

export const eventCron = () => {
    cron.schedule("*/5 * * * *", async () => {
        try {
            // console.log("start cron");

            // const events = await EventModel.findAll();
            // const today = new Date();
            const now = new Date();

            await EventModel.update(
                { status: "published" },
                {
                    where: {
                        status: "draft",
                        booking_start_date: { [Op.lte]: now }
                    }
                }
            );

            await EventModel.update({
                status: "ongoing",
            },
                {
                    where: {
                        status: "published",
                        start_date: { [Op.lte]: now }
                    }
                }
            );

            await EventModel.update({
                status: "completed"
            },
                {
                    where: {
                        status: "ongoing",
                        end_date: { [Op.lte]: now }
                    }
                }
            )
        } catch (error) {
            console.log("EventCron Error ", error);
        }
    })
}


// for (const event of events) {
//     const bookingStart = new Date(event.booking_start_date);
//     const event_start_date = new Date(event.start_date); // converrt db date into js date for calcuate
//     //console.log("start_date ", start_date);
//     const event_end_date = new Date(event.end_date);
//     //console.log("end_date ", end_date);

//     if (event.status === "draft" && today >= bookingStart) {
//         await event.update({ status: "published" });
//         //console.log(" event.status ",event.status);
//     }


//     if (event.status === "published" && today >= event_start_date) {
//         await event.update({ status: "ongoing" });
//         //console.log(" event.status ",event.status);
//     }

//     if (event.status !== "completed" && today > event_end_date) {
//         await event.update({ status: 'completed' });
//     }

// }