import UserModel from "./UserModel";
import EventModel from "./EventModel";
import ReviewModel from "./ReviewModel";
import BookingModel from "./BookingModel";
import AuditLogModel from "./AuditLogModel";

EventModel.hasMany(BookingModel, {
    foreignKey: "event_id",
    as: "bookings"
});

BookingModel.belongsTo(EventModel, {
    foreignKey: "event_id",
    as: "event"
})

UserModel.hasMany(BookingModel, {
    foreignKey: "user_id",
    as: "bookings"
});

BookingModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user"
});

UserModel.hasMany(ReviewModel, {
    foreignKey: "user_id",
    as: "reviews"
});

ReviewModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user"
});

EventModel.hasMany(ReviewModel, {
    foreignKey: "event_id",
    as: "reviews"
});

ReviewModel.belongsTo(EventModel, {
    foreignKey: "event_id",
    as: "event"
});

UserModel.hasMany(EventModel, {
    foreignKey: "organizer_id", as: "organized_events"
});

EventModel.belongsTo(UserModel, {
    foreignKey: "organizer_id", as: "organizer"
});


UserModel.hasMany(AuditLogModel, {
    foreignKey: "user_id",
    as: "activites"
})

AuditLogModel.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user"
})


export { UserModel, EventModel, ReviewModel, BookingModel, AuditLogModel }