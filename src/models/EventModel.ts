import { Model,Optional, DataTypes } from "sequelize";
import { sequelize_db } from "../config/db";

interface EventAttributes {
    event_id : number;
    organizer_id : number;
    category_id: number;
    title: string;
    image_url: string | null;
    description: string | null;
    location: string | null;
    start_date: Date;
    end_date: Date;
    event_time: string;
    ticket_price: number;
    total_seats: number;
    available_seats: number;
    status: "draft" | "published" | "cancelled" | "completed";
    created_datetime: Date;
    deleted_at: Date | null;
}

interface EventCreationAttributes extends Optional<
    EventAttributes,
    | "event_id" | "image_url" | "description"| "location"
  | "available_seats"| "created_datetime"| "deleted_at"
>{}

class EventModel extends Model<EventAttributes,EventCreationAttributes> 
implements EventAttributes
{
    public event_id!: number;
    public organizer_id!: number;
    public category_id!: number;
    public title!: string;
    public image_url!: string | null;
    public description!: string | null;
    public location!: string | null;
    public start_date!: Date;
    public end_date!: Date;
    public event_time!: string;
    public ticket_price!: number;
    public total_seats!: number;
    public available_seats!: number;
    public status!: "draft" | "published" | "cancelled" | "completed";
    public created_datetime!: Date;
    public deleted_at!: Date | null;
}    

EventModel.init(
    {
        event_id:{
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        organizer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    event_time: {
      type: DataTypes.TIME,
      allowNull: false
    },

    ticket_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    total_seats: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    available_seats: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    status: {
      type: DataTypes.ENUM("draft", "published", "cancelled", "completed"),
      allowNull: false,
      defaultValue : "draft"
    },

    created_datetime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize: sequelize_db,
    tableName: "events",
    timestamps: true,
    paranoid: true,
    createdAt : "created_datetime",
    updatedAt : false,
    deletedAt: "deleted_at"
  }
);

export default EventModel;
