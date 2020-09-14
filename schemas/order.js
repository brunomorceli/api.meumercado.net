'use strict';

const joi = require('joi');

const ct = require('./customTypes');

module.exports = {
  id: joi.number().min(1).required(),
  observation: joi.string().max(1024).optional().allow(null, ''),
  deliveryMethod: joi.string().allow('withdraw', 'delivery').required(),
  paymentMethod: joi.string().allow('cash', 'credit_card').required(),
  creditCardCompany: joi.string().allow(
    'visa',
    'mastercard',
    'american_express',
    'discover',
    'dinners_club',
    'maestro'
  ).optional().allow(null, ''),
  amount: joi.number().positive().precision(2).required(),
  changeTo: joi.number().positive().precision(2).required(),
  status: joi.string().allow(
    'pending', // waiting for confirmation
    'prepare', // is being prepared
    'delivery', // is going to be delivered
    'vendor_cancel', // was canceled by vendor
    'client_cancel', // was canceled by client
    'expire', // expired
    'done', // success
    'deleted' // the order was deleted    
  ).optional().allow(null, ''),

  createdAt: joi.string().min(10).optional().allow(null),
  updatedAt: joi.string().min(10).optional().allow(null),
};
