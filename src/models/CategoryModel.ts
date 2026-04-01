import { Model, DataType, Optional, DataTypes } from "sequelize";
import { sequelize_db } from "../config/db";

interface CategoryAttributes {
  category_id: number;
  name: string;
  description: string | null;
  status: "active" | "inactive";
  deleted_at: Date | null;
}

interface CategoryCreationAttributes extends Optional<
  CategoryAttributes,
  "category_id" | "description" | "status" | "deleted_at"
> { }

class CategoryModel
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes {
  public category_id!: number;
  public name!: string;
  public description!: string | null;
  public status!: "active" | "inactive";

  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at!: Date | null;
}

CategoryModel.init(
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active"
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }

  },
  {
    sequelize: sequelize_db,
    tableName: "event_categories",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true
  }
)

export default CategoryModel;