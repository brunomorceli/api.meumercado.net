const Async = require('async');
const Uuid = require('uuid');
const Joi = require('joi');
const Axios = require('axios');
const _ = require('lodash');

const {
  models,
  schemas,
  config
} = require('globals');

function getSchema() {

  let schema = { observation: schemas.order.observation };

  schema.products = Joi.array().items({
    id: schemas.product.id,
    quantity: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
    amount: Joi.number().min(0).required()
  }).required();

  schema.shipping = _.pick(schemas.userShipping, [
    'id',
    'label',
    'address',
    'city',
    'state',
    'zipCode',
    'country'
  ]);

  schema.payment = {
    moment: Joi.string().allow('withdraw','delivery').required(),
    method: Joi.string().allow('cash', 'card').required(),
    cardCharge: Joi.string().allow('debit', 'credit').required(),
    cardBrand: Joi.string().allow(
      'visa',
      'mastercard',
      'american_express',
      'discover',
      'dinners_club',
      'maestro'
    ).required(),
    charge: Joi.number().min(0).required(),
    cardId: schemas.userCard.id.allow(null)
  };

  return schema;
}

module.exports = {
  method: 'post',
  path: '/clients/orders/create',
  auth: 'common',
  validate: { body: getSchema() },
  handler: (req, res) => {
    // create a new user and profiles.
    models.sequelize
    .transaction((transaction) => {
      return new Promise((resolve, reject) => {
        Async.waterfall([
          // start the transaction.
          next => next(null, {
            userId: req.credentials.userId,
            ownerId: req.credentials.ownerId,
            ownerIntegration: null,
            userCard: null,
            thirdParty: null,
            order: null,
            payment: null,
            shipping: null,
            transaction: transaction
          }),

          // get owner integration 
          (data, next) => {
            const options = {
              where: {
                ownerId: data.ownerId,
                company: 'pagarme'
              }
            };

            models.ownerIntegration
            .findOne(options)
            .then(result => {
              if (!Boolean(result) || (result.metadata.apiKey || '').length === 0) {
                return next('Owner integration not found', data);
              }
              
              data.ownerIntegration = result;
              next(null, data);
            })
            .catch(() => next('Error on try to get owner integration', data));
          },

          // try to get credit card
          (data, next) => {
            const payment = req.body.payment;
            if (payment.moment !== 'online' || !payment.cardId) {
              return next(null, data);
            }

            const options = {
              where: {
                id: payment.cardId,
                status: 'active'
              }
            };

            models.userCard
            .findOne(options)
            .then(userCard => {
              data.userCard = userCard;
              next(null, data);
            })
            .catch(() => next('Error on try to get user card', data));
          },

          // try to create the order.
          (data, next) => {
            const orderData = Object.assign({}, req.body, {
              ownerId: req.credentials.ownerId,
              clientId: req.credentials.userId,
              observation: '',
              status: 'pending',
            });

            models.order
            .create(orderData, { transaction: data.transaction })
            .then(order => {
              data.order = order;
              next(null, data);
            })
            .catch(() => next('Error on try to create order.', data));
          },

          // try to create products
          (data, next) => {
            const values = req.body.products.map(product => {
              return {
                id: Uuid(),
                orderId: data.order.id,
                productId: product.id,
                price: product.price,
                quantity: product.quantity,
                amount: product.amount
              };
            });

            models.orderProduct
            .bulkCreate(values, { transaction: data.transaction })
            .then(() => next(null, data))
            .catch(() => next('Error on try to add products', data));
          },

          // try to charge using thrid party
          (data, next) => {
            if (!data.userCard) {
              return next(null, data);
            }

            const baseUri = config.pagarme.baseUri;
            const amount = req.body.products
            .map(p => p.amount)
            .reduce((sum, curr) => sum + curr, 0);

            const registryData = {
              amount: amount,
              api_key: data.ownerIntegration.metadata.apiKey,
              card_id: data.userCard.metadata.id
            };

            Axios.post(baseUri + '/transactions', registryData)
            .then(result => {
              if (result.data.status !== 'paid') {
                return next('Error on try to pay with card', data);
              }

              data.thirdParty = result.data;
              next(null, data);
            })
            .catch(error => {
              next(error.response.data.errors[0].message, data);
            });
          },

          // add order payment
          (data, next) => {
            const registryData = Object.assign(req.body.payment, {
              id: Uuid(),
              orderId: data.order.id,
              cardId: (data.userCard || {}).id || null,
              paymentStatus: Boolean(data.thirdParty) ? 'paid' : 'pending',
              status: 'active'
            });

            models.orderPayment
            .create(registryData, { transaction: data.transaction })
            .then(result => {
              data.payment = result;
              next(null, data);
            })
            .catch(() => next('Error on try to create payment order', data));
          },

          // add order shipping
          (data, next) => {
            const registryData = Object.assign(req.body.shipping, {
              id: Uuid(),
              orderId: data.order.id,
              status: 'active'
            });

            models.orderShipping
            .create(registryData, { transaction: data.transaction })
            .then(result => {
              data.shipping = result;
              next(null, data);
            })
            .catch(() => next('Error on try to create shipping', data));
          }
        ],
        (error, data) => error ? reject(error) : resolve(data)); // end waterfall
      }); // end promise
    })
    .then(data => res.json({ id: data.order.id }))
    .catch(error => res.status(500).json({ message: error }));
  }
};
