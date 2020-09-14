const _ = require('lodash');
const Joi = require('joi');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'post',
  path: '/admins/products/list',
  auth: 'common',
  validate: {
    body: {
      status: schemas.product.status,
      in: Joi.array().items(schemas.product.status).optional(),
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

    models.product
    .findAll(query)
    .then(products => 
      res.json(products.map(u => models.product.filter(u)))
    )
    .catch(() => {
      res.status(500).json({ message: 'Error on try to get products'});
    });
  }
};
