import { Model,DataTypes,Optional } from "sequelize";
import { sequelize_db } from "../config/db";

interface AuditLogAttributes{
    audit_id: number;
    user_id: number;              
    action: string;
    entity_type: string;
    entity_id: number | null;
    description: string | null;
    ip_address: string | null;
   // created_at: Date;
}

interface AuditLogCreationAttributes extends Optional<
    AuditLogAttributes,
    "audit_id" | "entity_id" | "description" | "ip_address" 
>{}

class AuditLogModel
extends Model<AuditLogAttributes,AuditLogCreationAttributes>
implements AuditLogAttributes
{
    public audit_id!: number;
    public user_id!: number;
    public action!: string;
    public entity_type!: string;
    public entity_id!: number | null;
    public description!: string | null;
    public ip_address!: string | null;
    public created_at!: Date;
}    

AuditLogModel.init(
    {
        audit_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        entity_type: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        entity_id:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ip_address: {
            type: DataTypes.STRING(50),
            allowNull: true
        }
        // created_at: {
        //     type: DataTypes.DATE,
        //     defaultValue: DataTypes.NOW
        // }
    },
    {
        sequelize: sequelize_db,
        tableName: "audit_logs",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    }
)

export default AuditLogModel;