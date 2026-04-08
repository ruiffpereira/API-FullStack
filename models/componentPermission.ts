import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class ComponentPermission extends Model<
  InferAttributes<ComponentPermission>,
  InferCreationAttributes<ComponentPermission>
> {
  declare componentPermissionId: CreationOptional<string>;
  declare componentId: string;
  declare permissionId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initComponentPermission(sequelize: Sequelize): void {
  ComponentPermission.init(
    {
      componentPermissionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      componentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Components", key: "componentId" },
      },
      permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "Permissions", key: "permissionId" },
      },
    },
    {
      sequelize,
      modelName: "ComponentPermission",
      tableName: "ComponentPermissions",
    },
  );
}
