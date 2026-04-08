import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Subcategory extends Model<
  InferAttributes<Subcategory>,
  InferCreationAttributes<Subcategory>
> {
  declare subcategoryId: CreationOptional<string>;
  declare name: string;
  declare categoryId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initSubcategory(sequelize: Sequelize): void {
  Subcategory.init(
    {
      subcategoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        validate: { notEmpty: true },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Categories", key: "categoryId" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    { sequelize, modelName: "Subcategory", tableName: "Subcategories" },
  );
}
