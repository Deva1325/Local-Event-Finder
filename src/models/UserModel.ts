import { Model, DataTypes, Optional } from "sequelize";
import { sequelize_db } from "../config/db";
import ReviewModel from "./ReviewModel";

interface UserAttributes {
  user_id: number;
  name: string;
  email: string;
  password: string;
  phone: string | null;
  role: "admin" | "organizer" | "user";
  is_verified: boolean;
  status: "active" | "blocked";
  refresh_token: string | null;
  reset_password_token: string | null;
  reset_password_expiry: Date | null;
  failed_login_attempts: number;
  lock_until: Date | null;
  // created_at: Date;
  // updated_at: Date;
  deleted_at: Date | null;
  verification_token: string | null;
  verification_token_expiry: Date | null;
  organizer_status: "pending" | "approved" | "rejected" | null;
}

interface UserCreationAttributes extends Optional<
  UserAttributes,
  | "user_id"
  | "phone"
  | "refresh_token"
  | "reset_password_token" | "reset_password_expiry" | "failed_login_attempts" | "lock_until"
  | "verification_token" | "verification_token_expiry"
  // | "created_at" | "updated_at" | "deleted_at"> {}
  | "deleted_at"
  | "organizer_status"
> { }

class UserModel extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public user_id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string | null;
  public role!: "admin" | "organizer" | "user";
  public is_verified!: boolean;
  public status!: "active" | "blocked";
  public refresh_token!: string | null;
  public reset_password_token!: string | null;
  public reset_password_expiry!: Date | null;
  public failed_login_attempts!: number;
  public lock_until!: Date | null;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at!: Date | null;
  public verification_token!: string | null;
  public verification_token_expiry!: Date | null;
  public organizer_status!: "pending" | "approved" | "rejected" | null;
}

UserModel.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    role: {
      type: DataTypes.ENUM("admin", "organizer", "user"),
      allowNull: false
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("active", "blocked"),
      allowNull: false
    },

    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    reset_password_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },

    reset_password_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },

    failed_login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    lock_until: {
      type: DataTypes.DATE,
      allowNull: true
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },

    verification_token: {
      type: DataTypes.STRING,
      allowNull: true
    },

    verification_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    organizer_status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: true
    }
    // created_at: {
    //   type: DataTypes.DATE,
    //   allowNull: false
    // },

    // updated_at: {
    //   type: DataTypes.DATE,
    //   allowNull: false
    // },



  }, {
  sequelize: sequelize_db,
  tableName: "users",
  timestamps: true,
  createdAt: "created_at", //  Tell Sequelize your column is called 'created_at'
  updatedAt: "updated_at", // Tell Sequelize your column is called 'updated_at'
  deletedAt: "deleted_at",
  paranoid: true
}
);


export default UserModel;

