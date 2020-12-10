'use strict';

const joi = require('joi');

const ct = require('./customTypes');

module.exports = {
  id: ct.uuid,
  companyId: ct.uuid.required(),
  name: joi.string().min(1).max(128).required(),
  description: joi.string().max(1024).optional(),
  thumbnail: joi.string().min(128).allow(null),
  status: joi.string().allow('active', 'deleted').required(),
  categories: joi.array().items(ct.uuid).allow([]),
  price: joi.number().positive().precision(2).required(),
  availability: joi.string().allow('unlimited', 'quantity').required(),
  stock: joi.number().min(0).required(),
  createdAt: joi.string().min(10).optional().allow(null),
  updatedAt: joi.string().min(10).optional().allow(null),
};
