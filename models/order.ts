import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare orderId: CreationOptional<string>;
  declare userId: string;
  declare customerId: string;
  declare price: CreationOptional<number>;
  declare shippingAddress: CreationOptional<string | null>;
  declare billingAddress: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initOrder(sequelize: Sequelize): void {
  Order.init(
    {
      orderId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "userId" },
      },
      customerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Customers", key: "customerId" },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: { isDecimal: true, min: 0 },
      },
      shippingAddress: { type: DataTypes.UUID, allowNull: true },
      billingAddress: { type: DataTypes.UUID, allowNull: true },
    },
    { sequelize, modelName: "Order", tableName: "Orders" },
  );
}
