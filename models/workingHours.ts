import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class WorkingHours extends Model<
  InferAttributes<WorkingHours>,
  InferCreationAttributes<WorkingHours>
> {
  declare workingHoursId: CreationOptional<string>;
  declare dayOfWeek: number;
  declare startTime: string;
  declare endTime: string;
  declare isActive: CreationOptional<boolean>;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initWorkingHours(sequelize: Sequelize): void {
  WorkingHours.init(
    {
      workingHoursId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      dayOfWeek: { type: DataTypes.INTEGER, allowNull: false },
      startTime: { type: DataTypes.STRING(5), allowNull: false },
      endTime: { type: DataTypes.STRING(5), allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "userId" },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, modelName: "WorkingHours", tableName: "WorkingHours" },
  );
}
