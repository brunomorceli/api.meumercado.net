const Async = require('async');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'delete',
  path: '/clients/shippings/:id/delete',
  auth: 'common',
  validate: {
    params: { id: schemas.userShipping.id }
  },
  handler: (req, res) => {
    Async.waterfall([
      next => next(null, {
        ownerId: req.credentials.ownerId,
        Op: models.Sequelize.Op
      }),

      // get the existing shipping
      (data, next) => {
        const query = {
          where: {
            id: req.params.id,
            ownerId: data.ownerId
          }
        };

        models.userShipping
        .findOne(query)
        .then(shipping => {
          if (!shipping) {
            return next('errCatNotFound', data);
          }

          data.shipping = shipping;
          next(null, data);
        })
        .catch(() => next('Error on try to get shipping', data));
      },

      // update shipping
      (data, next) => {
        Object.assign(data.shipping, req.body, {
          status: 'inactive',
          isDefault: false
        });

        data.shipping
        .save()
        .then(shipping => {
          data.shipping = shipping;
          next(null, data);
        })
        .catch(() => next('Error on try to delete shipping.', data));
      }
    ],
    error => {
      if (error) {
        return res.status(400).json({ message: error });
      }

      res.json({ id: req.params.id });
    });
  }
};
