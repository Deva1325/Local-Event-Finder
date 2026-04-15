import { Model,Optional, DataTypes } from "sequelize";
import { sequelize_db } from "../config/db";

interface LoginLogAttributes {
    login_log_id: number;
    user_id: number | null;
    ip_address: string | null;
    login_time: Date;
    logout_time: Date | null;
    is_logout: boolean;
    created_at: Date;
}

interface LoginLogCreationAttributes extends Optional<
    LoginLogAttributes,
    | "login_log_id"| "user_id" | "ip_address"| "login_time"
    | "is_logout"
    | "created_at"
>{}

class LoginLogModel
    extends Model<LoginLogAttributes,LoginLogCreationAttributes>
    implements LoginLogAttributes
{
    public login_log_id!: number;     
    public user_id!: number | null;     
    public ip_address!: string | null ;     
    public login_time!: Date;     
    public logout_time!: Date | null;     
    public is_logout!: boolean;     
    public created_at!: Date;     
}

LoginLogModel.init(
    {
        login_log_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ip_address: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        login_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        
        logout_time:{
            type:DataTypes.DATE,
            allowNull: true
        }
        ,
            is_logout:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE
        },
    },
    {
        sequelize: sequelize_db,
        tableName: "login_logs",
        timestamps: false
    }
)

export default LoginLogModel;