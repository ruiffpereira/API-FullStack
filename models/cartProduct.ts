import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class CartProduct extends Model<
  InferAttributes<CartProduct>,
  InferCreationAttributes<CartProduct>
> {
  declare cartItemId: CreationOptional<string>;
  declare cartId: string;
  declare productId: string;
  declare quantity: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initCartProduct(sequelize: Sequelize): void {
  CartProduct.init(
    {
      cartItemId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Carts", key: "cartId" },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Products", key: "productId" },
      },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "CartProduct",
      tableName: "CartProducts",
      timestamps: true,
    },
  );
}
