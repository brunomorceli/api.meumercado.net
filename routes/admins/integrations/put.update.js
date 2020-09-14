const Async = require('async');
const Joi = require('joi');
const Uuid = require('uuid');

const { models } = require('globals');

module.exports = {
  method: 'put',
  path: '/admins/integrations/pagarme/update',
  auth: 'common',
  validate: {
    body: { apiKey: Joi.string().max(128).required().allow(null) }
  },
  handler: (req, res) => {

    Async.waterfall([
      // start the transaction.
      next => next(null, {
        apiKey: req.body.apiKey
      }),

      // try get an existing registry
      (data, next) => {
        const query = {
          where: {
            ownerId: req.credentials.ownerId,
            company: 'pagarme',
          }
        };

        models.ownerIntegration
        .findOne(query)
        .then(registry => {
          data.registry = registry;
          next(null, data);
        })
        .catch(() => next('Error on try to get owner integration', data));            
      },

      // try to update ax existing registry
      (data, next) => {
        data.registry.set({ 'metadata.apiKey': data.apiKey });
        data.registry
        .save()
        .then(registry => {
          data.registry = registry;
          next(null, data);
        })
        .catch(() => next('Error on try to update integration', data));
      }
    ],
    (error, data) => {
      if (error) {
        return res.status(500).json({ message: error });
      }

      res.json(models.ownerIntegration.filter(data.registry.toJSON()));
    });
  }
};
