import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    user_id: number;
    role: string;
    email?: string;
    organizer_status?: string;
  };
}
