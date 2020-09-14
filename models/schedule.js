'use strict';

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('schedule', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
  }, {});

  model.associate = function(models) {
    model.belongsTo(models.user, {
      foreignKey: { allowNull: false }
    });
  };
  return model;
};
