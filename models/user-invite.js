'use strict';

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('user_invite', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(['active', 'denied', 'cancelled', 'accepted']),
      allowNull: false,
      defaultValue: 'active'
    },
  }, {});

  model.associate = function(models) { 
    model.belongsTo(models.user, {
      foreignKey: { allowNull: true }
    });
  };

  return model;
};
