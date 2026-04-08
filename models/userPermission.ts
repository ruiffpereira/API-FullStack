import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class UserPermission extends Model<
  InferAttributes<UserPermission>,
  InferCreationAttributes<UserPermission>
> {
  declare userId: string;
  declare permissionId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initUserPermission(sequelize: Sequelize): void {
  UserPermission.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Users", key: "userId" },
      },
      permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Permissions", key: "permissionId" },
      },
    },
    { sequelize, modelName: "UserPermission", tableName: "UserPermissions" },
  );
}
