'use strict';

const joi = require('joi');

const ct = require('./customTypes');

module.exports = {
  id: ct.uuid,
  ownerId: ct.uuid.required(),
  label: joi.string().max(128).required(),
  address: joi.string().max(512).required(),
  city: joi.string().max(256).required(),
  state: joi.string().max(128).required(),
  zipCode: joi.string().max(128).required(),
  country: joi.string().max(128).required(),
  status: joi.string().allow('active', 'inactive').required(),
  createdAt: joi.string().min(10).optional().allow(null),
  updatedAt: joi.string().min(10).optional().allow(null),
};
