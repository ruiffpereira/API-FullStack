module.exports = (sequelize, DataTypes) => {
  const UserPermission = sequelize.define('UserPermission', {
    userpermissionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
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
  },
  {
    paranoid: true,
  }
);

  return UserPermission;
};