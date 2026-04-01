import { Sequelize } from "sequelize";
import { ENV } from "./env";

export const sequelize_db = new Sequelize(
    ENV.DB_NAME,
    ENV.DB_USER,
    ENV.DB_PASSWORD,
    {
        host: ENV.DB_HOST,
        port: ENV.DB_PORT,
        dialect: "mysql",
        logging: false
    }
);

export const connectDB = async () => {
    try {
        await sequelize_db.authenticate();
        console.log("Database connected Successfully!");
    } catch (error) {
        console.error("Database Connection Failed!", error);
    }
};

