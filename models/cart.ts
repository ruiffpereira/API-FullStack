import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface CartAttributes {
  cartId: string;
  customerId: string;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'cartId'> {}

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public cartId!: string;
  public customerId!: string;
}

module.exports = (sequelize: Sequelize): typeof Cart => {

  Cart.init(
    {
      cartId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      customerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Customers',
          key: 'customerId',
        },
      },
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'Carts'
    }
  );

  return Cart;
};