const Async = require('async');
const _ = require('lodash');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'put',
  path: '/admins/products/update',
  auth: 'common',
  validate: {
    body: _.pick(schemas.product, [
      'id',
      'name',
      'description',
      'categories',
      'price',
      'availability',
      'stock',
      'status'
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
            id: { [data.Op.ne]: req.body.id },
            ownerId: data.ownerId,
            name: { [data.Op.iLike]: req.body.name },
            status: 'active',
          }
        };

        models.product
        .findOne(query)
        .then(product => next(Boolean(product) ? 'errCatInUse.' : null, data))
        .catch(() => next('Error on try to check existing product', data));
      },

      // get the existing product
      (data, next) => {
        const query = {
          where: {
            id: req.body.id,
            ownerId: data.ownerId
          }
        };

        models.product
        .findOne(query)
        .then(product => {
          if (!product) {
            return next('errCatNotFound', data);
          }

          data.product = product;
          next(null, data);
        })
        .catch(() => next('Error on try to get product', data));
      },

      // update product
      (data, next) => {
        Object.assign(data.product, req.body);

        console.log(req.body)

        data.product
        .save()
        .then(product => {
          data.product = product;
          next(null, data);
        })
        .catch(() => next('Error on try to update product.', data));
      }
    ],
    (error, data) => {
      if (error) {
        return res.status(400).json({ message: error });
      }

      res.json(_.pick(data.product, [
        'id',
        'name',
        'description',
        'color',
        'categories'
      ]));
    });
  }
};
