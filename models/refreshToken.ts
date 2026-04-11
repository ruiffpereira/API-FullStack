import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class RefreshToken extends Model<
  InferAttributes<RefreshToken>,
  InferCreationAttributes<RefreshToken>
> {
  declare id: CreationOptional<string>;
  declare token: string;
  declare customerId: CreationOptional<string | null>;
  declare userId: CreationOptional<string | null>;
  declare expiresAt: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initRefreshToken(sequelize: Sequelize): void {
  RefreshToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      token: { type: DataTypes.STRING, allowNull: false, unique: true },
      customerId: { type: DataTypes.UUID, allowNull: true },
      userId: { type: DataTypes.UUID, allowNull: true },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    },
    { sequelize, modelName: "RefreshToken", tableName: "RefreshTokens" },
  );
}
