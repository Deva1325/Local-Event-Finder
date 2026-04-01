import crypto from "crypto";

export const generateToken = (): string => {
    return crypto.randomBytes(32).toString("hex");
}

//crypto.randomBytes() :- generates a secure random token used for email verification.