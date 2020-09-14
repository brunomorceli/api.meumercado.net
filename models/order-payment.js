'use strict';

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('order_payment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
    },
    
    moment: {
      type: DataTypes.ENUM(['online','delivery', 'withdraw']),
      allowNull: false,
      defaultValue: 'withdraw'
    },
    method: {
      type: DataTypes.ENUM(['cash', 'card']),
      allowNull: false,
      defaultValue: 'cash'
    },
    cardCharge: {
      type: DataTypes.ENUM(['debit', 'credit']),
      field: 'card_charge',
      allowNull: false,
      defaultValue: 'debit'
    },
    cardBrand: {
      type: DataTypes.ENUM(['visa', 'mastercard', 'american_express', 'discover', 'dinners_club', 'maestro']),
      field: 'card_brand',
      allowNull: true,
      defaultValue: null
    },
    charge: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    paymentStatus: {
      type: DataTypes.ENUM(['pending', 'paid']),
      field: 'payment_status',
      allowNull: false,
      defaultValue: 'pending'
    },
    status: {
      type: DataTypes.ENUM(['active', 'inactive']),
      allowNull: false,
      defaultValue: 'active'
    }
  });

  model.associate = function(models) {
    model.belongsTo(models.order, {
      foreignKey: { allowNull: false }
    });

    model.belongsTo(models.userCard, {
      as: 'card',
      foreignKey: { allowNull: true }
    });
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
