'use strict';

const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('owner_integration', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
    },
    company: {
      type: DataTypes.ENUM(['pagarme', 'pagseguro', 'paypal']),
      allowNull: false,
      defaultValue: 'pagarme'
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
  }, {});

  model.associate = function(models) {
    model.belongsTo(models.user, {
      as: 'owner',
      foreignKey: { allowNull: true }
    });
  };

  model.filter = (obj) => {
    return _.omit(obj, 'createdAt', 'updatedAt');
  }

  return model;
};
