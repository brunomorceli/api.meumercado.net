'use strict';

const joi = require('joi');

const ct = require('./customTypes');

module.exports = {
  id: ct.uuid,
  ownerId: ct.uuid.required(),
  name: joi.string().min(1).max(128).required(),
  icon: joi.string().min(1).max(128).required(), 
  status: joi.string().allow('active', 'deleted').required(),
  createdAt: joi.string().min(10).optional().allow(null),
  updatedAt: joi.string().min(10).optional().allow(null),
};
