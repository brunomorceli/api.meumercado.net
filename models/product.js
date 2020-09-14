'use strict';

const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('product', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    categories: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      defaultValue: []
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0
    },
    availability: {
      type: DataTypes.ENUM(['unlimited', 'quantity']),
      allowNull: false,
      defaultValue: 'unlimited'
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM(['active', 'inactive', 'deleted']),
      allowNull: false,
      defaultValue: 'active'
    }
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
      'description',
      'categories',
      'price',
      'availability',
      'stock',
      'status'
    ]);
  };

  return model;
};
