import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Customer extends Model<
  InferAttributes<Customer>,
  InferCreationAttributes<Customer>
> {
  declare customerId: CreationOptional<string>;
  declare name: string;
  declare photo: CreationOptional<string | null>;
  declare email: string;
  declare contact: string;
  declare refreshToken: CreationOptional<string | null>;
  declare password: CreationOptional<string | null>;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initCustomer(sequelize: Sequelize): void {
  Customer.init(
    {
      customerId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      photo: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: false },
      contact: { type: DataTypes.STRING, allowNull: false },
      refreshToken: { type: DataTypes.STRING, allowNull: true },
      password: { type: DataTypes.STRING, allowNull: true },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "userId" },
      },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { sequelize, modelName: "Customer", tableName: "Customers" },
  );
}
