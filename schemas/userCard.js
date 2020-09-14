'use strict';

const joi = require('joi');
const ct = require('./customTypes');

module.exports = {
  id: ct.uuid.required(),
  userId: ct.uuid.required(),
  ownerId: ct.uuid.required(),
  company: joi.string().allow('pagarme', 'pagseguro', 'paypal').required(),
  cardNumber: joi.string().min(5).required(),
  expirationDate: joi.string().length(4).required(),
  holderName: joi.string().min(3).required(),
  cvv: joi.string().min(3).required(),
  metadata: joi.object().allow({}).required(),
  createdAt: joi.string().min(10).optional().allow(null),
  updatedAt: joi.string().min(10).optional().allow(null),
};
