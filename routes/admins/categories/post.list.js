const _ = require('lodash');
const Joi = require('joi');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'post',
  path: '/admins/categories/list',
  auth: 'common',
  validate: {
    body: {
      updateNumber: Joi.string(),
      status: schemas.category.status,
      in: Joi.array().items(schemas.category.status).optional(),
    }
  },
  handler: (req, res) => {
    const Op = models.Sequelize.Op;
    const query = {
      where: {
        ownerId: req.credentials.ownerId,
        status: 'active'
      }
    };

    if (req.body.status) {
      query.where.status = req.body.status;
    }
    else if (req.body.in && req.body.in.length !== 0) {
      query.where.status = { [Op.in]: req.body.in };
    }

    models.category
    .findAll(query)
    .then(categories => {
      res.json(categories.map(u => models.category.filter(u)));
    })
    .catch(() => res.status(500).json({
      message: 'Error on try to get categories'
    }));
  }
};
