'use strict';

const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('order', {
    observation: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM([
        'pending', // waiting for confirmation
        'prepare', // is being prepared
        'delivery', // is going to be delivered
        'vendor_cancel', // was canceled by vendor
        'client_cancel', // was canceled by client
        'expire', // expired
        'done', // success
        'deleted' // the order was deleted
      ]),
      allowNull: false,
      defaultValue: 'pending'
    }
  });

  model.associate = function(models) {
    model.belongsTo(models.user, {
      as: 'client',
      foreignKey: { allowNull: false }
    });

    model.belongsTo(models.company, {
      foreignKey: { allowNull: false }
    });

    model.hasMany(models.orderProduct);
  };

  model.clientFilter = function(registry){
    return _.pick(registry, [
      'id',
      'deliveryMethod',
      'paymentMethod',
      'creditCardCompany',
      'amount',
      'status',
      'createdAt'
    ]);
  };

  return model;
};
