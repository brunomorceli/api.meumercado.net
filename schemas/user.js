'use strict';

const joi = require('joi');

const ct = require('./customTypes');

module.exports = {
  id: ct.uuid,
  ownerId: ct.uuid.required(),
  email: joi.string().email().required(),
  password: ct.password,
  token: joi.string().min(2).max(128).required(),
  loginAt: joi.string().min(10).optional().allow(null),
  firstName: joi.string().max(128).optional().allow(''),
  lastName: joi.string().max(128).optional().allow(''),
  description: joi.string().max(128).optional().allow(''),
  phoneNumber: joi.string().max(32).optional().allow(''),
  birthday: joi.string().min(10).optional().allow(null, ''),
  gender: joi.string().allow('male', 'female'),
  role: joi.string().allow('admin', 'user', 'client'),
  status: joi.string().allow('inviting', 'active', 'inactive', 'pending', 'cancelled'),
  confirmToken: joi.string().length(5).required(),
  createdAt: joi.string().min(10).optional().allow(null),
  updatedAt: joi.string().min(10).optional().allow(null),
};
