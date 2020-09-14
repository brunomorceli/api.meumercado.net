'use strict';

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('permission', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4
    },
    label: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: { en: '' },
    },
    status: {
      type: DataTypes.ENUM(['active', 'inactive']),
      allowNull: false,
      defaultValue: 'active'
    },
  }, {});

  model.associate = function(models) {
    model.hasMany(models.userPermission);
  };

  return model;
};
