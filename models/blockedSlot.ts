import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class BlockedSlot extends Model<
  InferAttributes<BlockedSlot>,
  InferCreationAttributes<BlockedSlot>
> {
  declare blockedSlotId: CreationOptional<string>;
  declare date: string;
  declare startTime: CreationOptional<string | null>;
  declare endTime: CreationOptional<string | null>;
  declare reason: CreationOptional<string | null>;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initBlockedSlot(sequelize: Sequelize): void {
  BlockedSlot.init(
    {
      blockedSlotId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      startTime: { type: DataTypes.STRING(5), allowNull: true },
      endTime: { type: DataTypes.STRING(5), allowNull: true },
      reason: { type: DataTypes.STRING, allowNull: true },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "userId" },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: "BlockedSlot", tableName: "BlockedSlots" },
  );
}
