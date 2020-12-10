const Async = require('async');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'delete',
  path: '/admins/products/:id/delete',
  auth: 'common',
  validate: {
    params: { id: schemas.product.id }
  },
  handler: (req, res) => {
    Async.waterfall([
      next => next(null, {
        Op: models.Sequelize.Op
      }),

      // get the existing product
      (data, next) => {
        const query = {
          where: { id: req.params.id }
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
        Object.assign(data.product, req.body, {
          status: 'deleted'
        });

        data.product
        .save()
        .then(product => {
          data.product = product;
          next(null, data);
        })
        .catch(() => next('Error on try to delete product.', data));
      }
    ],
    (error, data) => {
      if (error) {
        return res.status(400).json({ message: error });
      }

      res.json({ id: req.query.id });
    });
  }
};
