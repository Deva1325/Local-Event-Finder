import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    user_id: number;
    role: string;
    email?: string;
    organizer_status?: string;
  };
}

// declare global {
//     namespace Express {
//         interface Request {
//             user?: {
//                 user_id: number;
//                 role: string;
//                 email?: string;
//                 organization_status?: string;
//             }
//         }
//     }
// }

// export{};


//import * as express from "express";

// export interface AuthRequest extends Request {
//     user?: {
//         user_id: number;
//         role: string;
//         email?: string;
//         organizerStatus?: string;
//     };
// }