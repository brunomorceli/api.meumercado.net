const _ = require('lodash');
const Joi = require('joi');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'post',
  path: '/admins/companies/list',
  auth: 'common',
  validate: {
    body: {
      updateNumber: Joi.string(),
      status: schemas.company.status,
      in: Joi.array().items(schemas.company.status).optional(),
    }
  },
  handler: (req, res) => {
    const query = {
      where: {
        ownerId: req.credentials.ownerId,
        status: 'active'
      }
    };

    models.company.findAll(query)
    .then(result => res.json(result || []))
    .catch((k) => {
      console.log(k);
      res.status(500).json({ message: 'Error on try to get company'})
    });  
  }
};
