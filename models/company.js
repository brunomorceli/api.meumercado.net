'use strict';

const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('company', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDv4,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    search: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    district: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    zipcode: {
      type: DataTypes.STRING(9),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.BLOB,
      allowNull: true,
      get() {
        return this.getDataValue('thumbnail').toString('utf8');
      }
    },
    status: {
      type: DataTypes.ENUM(['active', 'inactive', 'suspended', 'deleted']),
      defaultValue: 'active',
      allowNull: false
    }
  });

  model.associate = function(models) {
    model.belongsTo(models.user, {
      as: 'owner',
      foreignKey: { allowNull: false }
    });
  
    model.hasMany(models.userCompany, {
      foreignKey: { allowNull: false }
    });
  };

  model.filter = function(registry) {
    return _.pick(registry, [
      'id',
      'label',
      'address',
      'number',
      'district',
      'city',
      'state',
      'zipcode',
      'country',
      'thumbnail',
      'status',
      'createdAt'
    ]);
  }

  return model;
};
