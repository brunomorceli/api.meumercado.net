const Async = require('async');
const _ = require('lodash');
const Uuid = require('uuid');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'post',
  path: '/admins/products/create',
  auth: 'common',
  validate: {
    body: _.pick(schemas.product, [
      'companyId',
      'name',
      'description',
      'categories',
      'price',
      'availability',
      'stock'
    ])
  },
  handler: (req, res) => {
    Async.waterfall([
      next => next(null, {
        ownerId: req.credentials.ownerId,
        Op: models.Sequelize.Op
      }),
      
      // check if the product already exists.
      (data, next) => {
        const query = {
          where: {
            companyId: req.body.companyId,
            name: { [data.Op.iLike]: req.body.name },
            status: 'active',
          }
        };

        models.product
        .findOne(query)
        .then(product => next(Boolean(product) ? 'errCatInUse' : null, data))
        .catch(e => next('Error on try to check existing product', data));
      },

      // try to create the product.
      (data, next) => {
        const productData = Object.assign(_.omit(req.body, 'thumbnail'), {
          id: Uuid(),
          status: 'active'
        });

        models.product
        .create(productData)
        .then(newproduct => {
          data.product = newproduct;
          next(null, data);
        })
        .catch(() => next('Error on try to create product.', data));
      }
    ],
    (error, data) => {
      if (error) {
        return res.status(400).json({ message: error });
      }

      res.json(models.product.filter(data.product));
    });
  }
};
