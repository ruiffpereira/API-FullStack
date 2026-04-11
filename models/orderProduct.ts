import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class OrderProduct extends Model<
  InferAttributes<OrderProduct>,
  InferCreationAttributes<OrderProduct>
> {
  declare orderproductId: CreationOptional<string>;
  declare orderId: string;
  declare productId: string;
  declare quantity: number;
  declare priceAtPurchase: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;
}

export function initOrderProduct(sequelize: Sequelize): void {
  OrderProduct.init(
    {
      orderproductId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Orders", key: "orderId" },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Products", key: "ProductId" },
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      priceAtPurchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: "OrderProduct",
      tableName: "OrderProducts",
      paranoid: true,
    },
  );
}
