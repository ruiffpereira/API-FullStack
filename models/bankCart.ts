import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class BankCard extends Model<
  InferAttributes<BankCard>,
  InferCreationAttributes<BankCard>
> {
  declare cardId: CreationOptional<string>;
  declare lastFourDigits: string;
  declare expirationDate: string;
  declare customerId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date | null>;
}

export function initBankCard(sequelize: Sequelize): void {
  BankCard.init(
    {
      cardId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      lastFourDigits: { type: DataTypes.STRING(4), allowNull: false },
      expirationDate: { type: DataTypes.STRING, allowNull: false },
      customerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Customers", key: "customerId" },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "BankCard",
      tableName: "BankCards",
      paranoid: true,
    },
  );
}
