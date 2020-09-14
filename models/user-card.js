'use strict';

const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('user_card', {
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

    brand: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: ''
    },

    holderName: {
      type: DataTypes.STRING(128),
      field: 'holder_name',
      allowNull: true,
      defaultValue: null
    },
 
    lastDigits: {
      type: DataTypes.STRING(128),
      field: 'last_digits',
      allowNull: true,
      defaultValue: null
    },

    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },

    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
  }, {});

  model.associate = function(models) {
    model.belongsTo(models.user, {
      foreignKey: { allowNull: false }
    });

    model.belongsTo(models.user, {
      as: 'owner',
      foreignKey: { allowNull: true }
    });
  };

  model.filter = function(registry){
    return _.pick(registry, [
      'id',
      'company',
      'brand',
      'holderName',
      'lastDigits',
      'createdAt'
    ]);
  };

  return model;
};
