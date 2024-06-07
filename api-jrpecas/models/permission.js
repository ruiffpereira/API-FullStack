module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    permissionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    paranoid: true,
  });

  return Permission;
};