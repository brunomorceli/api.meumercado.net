const Async = require('async');
const _ = require('lodash');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'put',
  path: '/clients/shippings/update',
  auth: 'common',
  validate: {
    body: _.omit(schemas.userShipping, [
      'ownerId',
      'clientId',
      'status',
      'createdAt',
      'updatedAt',
    ])
  },
  handler: (req, res) => {
    Async.waterfall([
      next => next(null, {
        Op: models.Sequelize.Op
      }),

      // check if the shipping already exists.
      (data, next) => {
        const query = {
          where: {
            id: { [data.Op.ne]: req.body.id },
            clientId: req.credentials.userId,
            ownerId: req.credentials.ownerId,
            label: { [data.Op.iLike]: req.body.label },
            status: 'active',
          }
        };

        models.userShipping
        .findOne(query)
        .then(shipping => next(Boolean(shipping) ? 'Label already in use' : null, data))
        .catch(() => next('Error on try to check existing shipping', data));
      },

      // get the existing shipping
      (data, next) => {
        const query = {
          where: {
            id: req.body.id,
            clientId: req.credentials.userId,
            ownerId: req.credentials.ownerId
          }
        };

        models.userShipping
        .findOne(query)
        .then(shipping => {
          if (!shipping) {
            return next('Registry not found', data);
          }

          data.shipping = shipping;
          next(null, data);
        })
        .catch(() => next('Error on try to get shipping', data));
      },

      // update shipping
      (data, next) => {
        Object.assign(data.shipping, req.body, {
          status: 'active'
        });

        data.shipping
        .save()
        .then(shipping => {
          data.shipping = shipping;
          next(null, data);
        })
        .catch(() => {
          next('Error on try to update shipping.', data);
        });
      }
    ],
    (error, data) => {
      if (error) {
        return res.status(400).json({ message: error });
      }

      res.json(models.userShipping.filter(data.shipping.toJSON()));
    });
  }
};
