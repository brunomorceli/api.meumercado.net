'use strict';

const joi = require('joi');

const ct = require('./customTypes');

module.exports = {
  id: ct.uuid,
  ownerId: ct.uuid.required(),
  label: joi.string().min(1).max(128).required(),
  search: joi.string().min(1).max(128).required(),
  address: joi.string().min(1).max(512).required(),
  number: joi.number().min(1).required(),
  district: joi.string().min(1).max(256).required(),
  city: joi.string().min(1).max(256).required(),
  state: joi.string().length(2).required(),
  zipcode: joi.string().length(9).regex(/^[0-9]{5}-[0-9]{3}/).required(),
  country: joi.string().min(2).max(128).required(),
  status: joi.string().allow('active', 'deleted').required(),
  createdAt: joi.string().min(10).optional().allow(null),
  updatedAt: joi.string().min(10).optional().allow(null),
};
