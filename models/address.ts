import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Address extends Model<
  InferAttributes<Address>,
  InferCreationAttributes<Address>
> {
  declare addressId: CreationOptional<string>;
  declare address: string;
  declare defaultAdressFaturation: boolean;
  declare defaultAdress: boolean;
  declare postalCode: string;
  declare city: string;
  declare phoneNumber: string;
  declare nif: string;
  declare addTaxpayer: boolean;
  declare customerId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;
}

export function initAddress(sequelize: Sequelize): void {
  Address.init(
    {
      addressId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      address: { type: DataTypes.STRING, allowNull: false },
      defaultAdressFaturation: { type: DataTypes.BOOLEAN, allowNull: false },
      defaultAdress: { type: DataTypes.BOOLEAN, allowNull: false },
      postalCode: { type: DataTypes.STRING, allowNull: false },
      city: { type: DataTypes.STRING, allowNull: false },
      phoneNumber: { type: DataTypes.STRING, allowNull: false },
      nif: { type: DataTypes.STRING, allowNull: false },
      addTaxpayer: { type: DataTypes.BOOLEAN, allowNull: false },
      customerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Customers", key: "customerId" },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    { sequelize, modelName: "Address", tableName: "Addresses", paranoid: true },
  );
}
