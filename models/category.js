'use strict';

const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('category', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(['active', 'deleted']),
      allowNull: false,
      defaultValue: 'active'
    },
  });

  model.associate = function(models) {
    model.belongsTo(models.user, {
      as: 'owner',
      foreignKey: { allowNull: true }
    });
  };

  model.filter = function(registry){
    return _.pick(registry, [
      'id', 
      'name',
      'icon',
      'status'
    ]);
  };

  return model;
};
