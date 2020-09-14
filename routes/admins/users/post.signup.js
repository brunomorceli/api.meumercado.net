const Bcrypt = require('bcrypt');
const Uuid = require('uuid');
const Async = require('async');
const Jwt = require('jsonwebtoken');
const _ = require('lodash');

const {
  models,
  config
} = require('globals');

module.exports = {
  method: 'post',
  path: '/admins/users/signup',
  validate: {
    body: null,
    query: null
  },
  handler: (req, res) => {
    // create a new user and profiles.
    models.sequelize
    .transaction((transaction) => {
      return new Promise((resolve, reject) => {
        Async.waterfall([
          // start the transaction.
          next => next(null, { transaction: transaction }),

          // check if the user already exists.
          (data, next) => {
            models.user
            .findOne({ where: { email: req.body.email }}, { transaction: data.transaction })
            .then(user => {
              if (Boolean(user)) { return next('User already exists.', data); }
              next(null, data);
            })
            .catch((k) => {
              console.log(k);
              next('Error on try to check existing user', data);
            });
          },

          // try to create the default company.
          (data, next) => {
            const objData = {
              id: Uuid(),
              name: 'Matrix',
              status: 'active'
            };

            models.company
            .create(objData, { transaction: data.transaction })
            .then(company => {
              data.company = company;
              next(null, data);
            })
            .catch(() => next('Error on try to create company.', data));
          },

          // try to create the user.
          (data, next) => {
            const id = Uuid();
            const sessionToken = Jwt.sign({
              createdAt: new Date(),
              ownerId: id,
              userId: id,
              remoteAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            }, config.tokenSecret);
            const userData = {
              id: id,
              ownerId: id,
              email: req.body.email,
              password: Buffer.from(Bcrypt.hashSync(req.body.password, 11)).toString('base64'),
              firstName: '',
              lastName: '',
              phoneNumber: '',
              gender: 'male',
              birthday: null,
              language: req.headers["accept-language"].substring(0, 2),
              selectedCompanyId: data.company.id,
              sessionToken: sessionToken,
              role: 'owner',
              status: 'active',
            };

            models.user
            .create(userData, { transaction: data.transaction })
            .then(newUser => {
              data.user = newUser;
              next(null, data);
            })
            .catch(() => next('Error on try to create user.', data));
          },

          // create the new user-company.
          (data, next) => {
            const dataObj = {
              id: Uuid(),
              userId: data.user.id,
              companyId: data.company.id,
            };

            models

            models.userCompany
            .create(dataObj, { transaction: data.transaction })
            .then(() => next(null, data))
            .catch(() => next('Error on try to create user-company', data));
          }
        ],
        (error, data) => error ? reject(error) : resolve(data)); // end waterfall
      }); // end promise
    })
    .then(data => {
      models.user
      .getRelationshipData({ id: data.user.id })
      .then((result) => res.json(result))
      .catch(error => 
        res.status(error.status).json({ message: error.message })
      );
    })
    .catch(error => res.status(400).json({ message: error }));
  }
};
