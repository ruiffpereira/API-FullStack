module.exports = (sequelize, DataTypes) => {
  const Component = sequelize.define('Component', {
    componentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Component;
};