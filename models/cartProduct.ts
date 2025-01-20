import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface CartAttributes {
  cartItemId: string;
  cartId: string;
  productId: string;
  quantity: number;

}

interface CartCreationAttributes extends Optional<CartAttributes, 'cartItemId'> {}

class CartProduct extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public cartItemId!: string;
  public cartId!: string;
  public productId!: string;
  public quantity!: number;
}

module.exports = (sequelize: Sequelize): typeof CartProduct => {

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
        references: {
          model: 'Carts',
          key: 'cartId',
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'productId',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CartProduct',
      tableName: 'CartProducts'
    }
  );

  return CartProduct;
};