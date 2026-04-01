import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "local_event_finder",
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://192.168.1.115:3000",

  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refreshsecret",

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};





// http://localhost:3000/api-docs

// http://192.168.1.103:3000/api-docs

/*
{
 "email": "john@example.com",
 "password": "123456"
}

{
  "email": "abhay@yopmail.com",
  "password": "123456"
}
*/

/*
{
  "email": "admin@eventfinder.com",
  "password": "admin@123"
}

*/