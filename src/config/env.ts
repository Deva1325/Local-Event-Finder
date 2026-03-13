import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "local_event_finder",
  DB_PORT: Number(process.env.DB_PORT) || 3306,

  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refreshsecret",

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL
};