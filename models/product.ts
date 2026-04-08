import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare productId: CreationOptional<string>;
  declare name: string;
  declare reference: string;
  declare stock: CreationOptional<number>;
  declare price: number;
  declare description: CreationOptional<string | null>;
  declare photos: CreationOptional<string[] | null>;
  declare categoryId: CreationOptional<string | null>;
  declare subcategoryId: CreationOptional<string | null>;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initProduct(sequelize: Sequelize): void {
  Product.init(
    {
      productId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        validate: { notEmpty: true },
      },
      name: { type: DataTypes.STRING, allowNull: false },
      reference: { type: DataTypes.STRING, allowNull: false },
      stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      price: { type: DataTypes.DECIMAL, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      photos: { type: DataTypes.JSON, allowNull: true },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "Categories", key: "categoryId" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      subcategoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "Subcategories", key: "subcategoryId" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "userId" },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: "Product", tableName: "Products" },
  );
}
