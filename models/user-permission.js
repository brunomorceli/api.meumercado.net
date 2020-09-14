'use strict';

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('user_permission', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
    },
  }, {});

  model.associate = function(models) {
    model.belongsTo(models.permission, {
      foreignKey: { allowNull: false }
    });

    model.belongsTo(models.user, {
      foreignKey: { allowNull: false }
    });
  };

  return model;
};
