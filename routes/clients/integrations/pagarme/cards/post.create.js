const Async = require('async');
const Uuid = require('uuid');
const Axios = require('axios');
const _ = require('lodash');

const {
  config,
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'post',
  path: '/clients/integrations/pagarme/cards/create',
  auth: 'common',
  validate: { body: _.pick(schemas.userCard, [
    'cardNumber',
    'expirationDate',
    'holderName',
    'cvv'
  ])},
  handler: (req, res) => {

    Async.waterfall([
      next => next(null, {
        userId: req.credentials.userId,
        ownerId: req.credentials.ownerId,
        ownerIntegration: null,
        thirdPartyCard: null,
        card: null
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

      // try to create 3rd party card
      (data, next) => {
        const baseUri = config.pagarme.baseUri;
        const apiKey = data.ownerIntegration.metadata.apiKey;
    
        const cardData = {
          api_key: apiKey,
          card_number: req.body.cardNumber,
          card_expiration_date: req.body.expirationDate,
          card_holder_name: req.body.holderName,
          card_cvv: req.body.cvv
        };

        Axios
        .post(baseUri + '/cards', cardData)
        .then(result => {    
          data.thirdPartyCard = result.data;
          next(null, data);
        })
        .catch(() => next('Error on try to create 3rd party card', data));
      },

      // create the local registry
      (data, next) => {
        const tpc = data.thirdPartyCard;
        const cardData = {
          id: Uuid(),
          userId: data.userId,
          ownerId: data.ownerId,
          company: 'pagarme',
          brand: tpc.brand,
          lastDigits: tpc.last_digits,
          holderName: tpc.holder_name,
          expirationDate: req.body.expirationDate,
          status: 'active',
          metadata: { id: tpc.id }
        };

        models.userCard
        .create(cardData)
        .then(card => {
          data.card = card;
          next(null, data);
        })
        .catch((k) => next('Error on try to create local card', data));
      }
    ], (error, data) => {
      if (error) {
        return res.status(500).json({ message: error });
      }

      res.json(models.userCard.filter(data.card.toJSON()));
    });
  }
};
