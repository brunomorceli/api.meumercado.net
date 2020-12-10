const Uuid = require('uuid');
const Async = require('async');
const _ = require('lodash');
const sum = require('hash-sum');

const {
  models,
  schemas,
  libs
} = require('globals');

module.exports = {
  method: 'post',
  path: '/admins/users/create',
  auth: 'common',
  validate: {
    body: _.pick(schemas.user, [
      'email',
      'firstName',
      'lastName',
      'description',
      'gender',
      'phoneNumber',
      'birthday'
    ])
  },
  handler: (req, res) => {
    const ownerId = req.credentials.ownerId;
    const Op = models.Sequelize.Op;

    // create a new user and profiles.
    models.sequelize
    .transaction((transaction) => {
      return new Promise((resolve, reject) => {
        Async.waterfall([
          // start the transaction.
          next => next(null, { transaction: transaction }),

          // check if the user already exists.
          (data, next) => {
            const query = {
              where: {
                email: req.body.email,
                status: { [Op.ne]: 'cancelled' }
              }
            };

            models.user
            .findOne(query, { transaction: data.transaction })
            .then(user => {
              if (Boolean(user)) { return next('errEmailInUse.', data); }
              next(null, data);
            })
            .catch(() => next('Error on try to check existing user', data));
          },

          // try to create the user.
          (data, next) => {
            const id = Uuid();
            const userData = {
              id: id,
              ownerId: ownerId,
              email: req.body.email,
              password: null,
              firstName: req.body.firstName || '',
              lastName: req.body.lastName || '',
              description: req.body.description || '',
              phoneNumber: req.body.phoneNumber || '',
              gender: req.body.gender || 'male',
              birthday: req.body.birthday || null,
              language: req.headers["accept-language"].substring(0, 2),
              selectedCompanyId: null,
              confirmToken: null,
              thumbnail: null,
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

          // try to send the email
          /*(data, next) => {
            const emailData = {
              to: req.body.email, 
              subject: 'Invitation - Mundigital.com.br',
              template: 'invite-user',
              params: {
                email: req.body.email,
                confirmToken: (data.user.confirmToken ||'').toUpperCase()
              },
            };
      
            libs.email
            .send(emailData)
            .then(() => next(null, data))
            .catch(() => next('Error on try to send email', data));
          }*/
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
