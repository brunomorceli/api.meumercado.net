const Bcrypt = require('bcrypt');
const Uuid = require('uuid');
const Async = require('async');
const Jwt = require('jsonwebtoken');
const _ = require('lodash');

const {
  models,
  schemas,
  libs
} = require('globals');

module.exports = {
  method: 'put',
  path: '/admins/authenticate',
  validate: {
    body: { phoneNumber: schemas.user.phoneNumber }
  },
  handler: (req, res) => {
    // create a new user and profiles.
    models.sequelize
    .transaction((transaction) => {
      return new Promise((resolve, reject) => {
        Async.waterfall([
          // start the transaction.
          next => next(null, {
            transaction: transaction,
            phoneNumber: req.body.phoneNumber
          }),

          // check if the user already exists.
          (data, next) => {
            const options = {
              where: {
                phoneNumber: req.body.phoneNumber
              }
            };

            models.user
            .findOne(options, { transaction: data.transaction })
            .then(user => {
              if (Boolean(user)) {
                data.user = user;
              }

              next(null, data);
            })
            .catch(() => next('Error on try to get existing user', data));
          },

          // try to create the user.
          (data, next) => {
            if (Boolean(data.user)) {
              return next(null, data);
            }

            const id = Uuid();
            const userData = {
              id: id,
              ownerId: id,
              email: null,
              password: null,
              firstName: '',
              lastName: '',
              phoneNumber: data.phoneNumber,
              gender: 'male',
              birthday: null,
              language: req.headers["accept-language"].substring(0, 2),
              thumbnail: null,
              status: 'confirmation',
              confirmToken: null
            };

            models.user
            .create(userData, { transaction: data.transaction })
            .then(newUser => {
              data.user = newUser;
              next(null, data);
            })
            .catch(() => next('Error on try to create user.', data));
          },

          // create and send a new token
          (data, next) => {
            data.user.confirmToken = models.user.generateConfirmToken();
            data.user
            .save({ transaction: data.transaction })
            .then(user => {
              data.user = user;
              next(null, data);
            })
            .catch(() => next('Error on try to update user'));
          },

          // send sms
          (data, next) => {
            const msg = 'Nearstore - Seu codigo de confimacao e: ' + data.user.confirmToken;
            libs.aws
            .sendSMS(msg, data.phoneNumber)
            .then(() => next(null, data))
            .catch(() => next('Error on try to send SMS', data));
          }
        ],
        (error, data) => error ? reject(error) : resolve(data)); // end waterfall
      }); // end promise
    })
    .then(() => res.json({}))
    .catch(error => res.status(500).json({ message: error }));
  }
};
