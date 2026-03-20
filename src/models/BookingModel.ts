import { Model,DataTypes,Optional } from "sequelize";
import { sequelize_db } from "../config/db";

interface BookingAttributes{
    booking_id : number;
    user_id: number;
    event_id: number;
  ticket_quantity: number;
  total_amount : number;
  booking_status : "confirmed" | "cancelled";
  deleted_at : Date | null
}

interface BookingCreationAttributes extends Optional<
    BookingAttributes,
    "booking_id" | "booking_status" | "deleted_at"
>{}

class BookingModel extends Model<BookingAttributes,BookingCreationAttributes> 
implements BookingAttributes{
    public booking_id!: number;
    public user_id!: number;
    public event_id!: number;
    public ticket_quantity!: number;
    public total_amount!: number;
    public booking_status!: "confirmed" | "cancelled";  
    public created_at!: Date;
    public updated_at!: Date;
    public deleted_at!: Date | null;
}

BookingModel.init(
    {
        booking_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        user_id : {
            type : DataTypes.INTEGER,
            allowNull : true
        },
        event_id : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        ticket_quantity : {
            type : DataTypes.INTEGER,
            allowNull : false
        },
        total_amount : {
            type : DataTypes.DECIMAL(10,2),
            allowNull : false
        },
        booking_status : {
            type : DataTypes.ENUM("confirmed","cancelled"),
            defaultValue : "confirmed"
        },
        deleted_at : {
            type : DataTypes.DATE,
            allowNull : true
        }
    },
    {
        sequelize : sequelize_db,
        tableName : "bookings",
        timestamps : true,
        createdAt : "created_at",
        updatedAt : "updated_at",
        deletedAt : "deleted_at",
        paranoid : true
    }
);

export default BookingModel;
