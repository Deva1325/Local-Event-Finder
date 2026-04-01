import { Model, Optional, DataTypes } from "sequelize";
import { sequelize_db } from "../config/db";
import UserModel from "./UserModel";
import EventModel from "./EventModel";

interface ReviewAttributes {
    review_id: number;
    user_id: number;
    event_id: number;
    rating: number;
    review_text: string | null;
    deleted_at: Date | null;
}

interface ReviewCreationAttributes extends Optional<
    ReviewAttributes,
    "review_id" | "review_text" | "deleted_at"
> { }

class ReviewModel extends Model<ReviewAttributes, ReviewCreationAttributes>
    implements ReviewAttributes {
    public review_id!: number;
    public user_id!: number;
    public event_id!: number;
    public rating!: number;
    public review_text!: string | null;
    public deleted_at!: Date | null;
}

ReviewModel.init({
    review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    event_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    review_text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
},
    {
        sequelize: sequelize_db,
        tableName: "reviews",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
        paranoid: true
    });

export default ReviewModel;