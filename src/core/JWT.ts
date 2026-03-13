import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export const generateAccessToken = (payload : object): string => {
    return jwt.sign(
        payload,
        ENV.JWT_SECRET as string,
        { expiresIn: ( ENV.JWT_EXPIRES_IN || "1h" ) as any }
    );
};

export const generateRefreshToken = (payload : object): string => {
    return jwt.sign(
        payload,
        ENV.JWT_REFRESH_SECRET as string,
        { expiresIn : ( ENV.JWT_REFRESH_EXPIRES_IN || "7d" ) as any }
    );
}

export const verifyRefreshToken = (token: string) =>{
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET as string);
}
