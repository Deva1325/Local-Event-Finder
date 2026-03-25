import UserModel from "./UserModel";
import EventModel from "./EventModel";
import ReviewModel from "./ReviewModel";

UserModel.hasMany(ReviewModel,{
  foreignKey: "user_id",
  as: "reviews"
});

ReviewModel.belongsTo(UserModel,{
    foreignKey: "user_id",
    as: "user" 
});

EventModel.hasMany(ReviewModel,{
  foreignKey: "event_id",
  as: "reviews"
});

ReviewModel.belongsTo(EventModel,{
    foreignKey: "event_id",
    as: "event"
});

UserModel.hasMany(EventModel,{
    foreignKey: "organizer_id", as: "organized_events"
});

EventModel.belongsTo(UserModel, {
    foreignKey: "organizer_id", as: "organizer"
});

export{ UserModel,EventModel,ReviewModel }