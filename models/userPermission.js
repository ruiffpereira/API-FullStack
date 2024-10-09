module.exports = (sequelize, DataTypes) => {
  const UserPermission = sequelize.define('UserPermission', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId',
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
  }
);

  return UserPermission;
};