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
