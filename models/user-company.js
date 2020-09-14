'use strict';

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('user_company', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
    },
    permissions: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    status: {
      type: DataTypes.ENUM(['active', 'inactive', 'deleted']),
      allowNull: false,
      defaultValue: 'active'
    },
  });

  model.associate = function(models) {
    model.belongsTo(models.user, {
      foreignKey: { allowNull: false }
    });
    model.belongsTo(models.company, {
      foreignKey: { allowNull: false }
    });
  };

  return model;
};
