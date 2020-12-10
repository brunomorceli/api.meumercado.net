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
    thumbnail: {
      type: DataTypes.BLOB,
      allowNull: true,
      get() {
        return this.getDataValue('thumbnail').toString('utf8');
      }
    },
    status: {
      type: DataTypes.ENUM(['active', 'deleted']),
      allowNull: false,
      defaultValue: 'active'
    },
  });

  model.associate = function(models) {
    model.belongsTo(models.company, {
      foreignKey: { allowNull: false }
    });
  };

  model.filter = function(registry){
    return _.pick(registry, [
      'id', 
      'name',
      'thumbnail',
      'status',
      'companyId'
    ]);
  };

  return model;
};
