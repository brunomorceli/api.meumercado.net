'use strict';

const joi = require('joi');

module.exports = {
  base64: joi.string().regex(/[0-9a-f]/),
  uuid: joi.string().regex(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/),
  password: joi.string().regex(/^[a-zA-Z0-9]{6,256}$/),
  ip: joi.string().min(7).max(15),
  color: joi.string().regex(/^#[A-Fa-f0-9]{6}/)
};
