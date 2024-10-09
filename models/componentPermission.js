module.exports = (sequelize, DataTypes) => {
  const ComponentPermission = sequelize.define('ComponentPermission', {
    componentPermissionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    componentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Components',
        key: 'componentId',
      },
    },
    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Permissions',
        key: 'permissionId',
      },
    },
  });

  return ComponentPermission;
};