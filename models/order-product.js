'use strict';

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('order_product', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0
    }
  });

  model.associate = function(models) {
    model.belongsTo(models.order, {
      foreignKey: { allowNull: false }
    });
    model.belongsTo(models.product, {
      foreignKey: { allowNull: false }
    });
  };

  return model;
};
