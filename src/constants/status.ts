export const ROLES = {
    ADMIN: "admin",
    USER: "user",
    ORGANIZER: "organizer"
} as const;

export const ORGANIZER_STATUS = {
    PENDING : "pending",
    APPROVED: "approved",
    REJECTED: "rejected"
}  as const;

export const BOOKING_STATUS = {
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    PENDING: "pending"
} as const;

export const EVENT_STATUS = {
    PUBLISHED: "published",
    ONGOING: "ongoing",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
} as const;