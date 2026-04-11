import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Shipping extends Model<
  InferAttributes<Shipping>,
  InferCreationAttributes<Shipping>
> {
  declare shippingId: CreationOptional<string>;
  declare title: string;
  declare description: CreationOptional<string | null>;
  declare price: number;
  declare categoryId: CreationOptional<string | null>;
  declare productId: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initShipping(sequelize: Sequelize): void {
  Shipping.init(
    {
      shippingId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      price: { type: DataTypes.FLOAT, allowNull: false },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "Categories", key: "categoryId" },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "Products", key: "productId" },
      },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Shipping",
      tableName: "Shippings",
      timestamps: true,
    },
  );
}
