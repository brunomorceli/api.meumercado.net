'use strict';

const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('user_shipping', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING(128),
      field: 'zip_code',
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(['active', 'inactive']),
      allowNull: false,
      defaultValue: 'active'
    },
  }, {});

  model.associate = function(models) {
    model.belongsTo(models.user, {
      as: 'owner',
      foreignKey: { allowNull: false }
    });

    model.belongsTo(models.user, {
      as: 'client',
      foreignKey: { allowNull: false }
    });
  };

  model.filter = function(registry){
    return _.omit(registry, [
      'updatedAt',
      'ownerId',
      'clientId',
      'status'
    ]);
  };

  return model;
};
