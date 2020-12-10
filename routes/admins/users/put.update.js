const Uuid = require('uuid');
const Async = require('async');
const _ = require('lodash');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'put',
  path: '/admins/users/update',
  auth: 'common',
  validate: {
    body: _.pick(schemas.user, [
      'id',
      'email',
      'firstName',
      'lastName',
      'description',
      'gender',
      'phoneNumber',
      'birthday',
      'thumbnail',
      'status'
    ])
  },
  handler: (req, res) => {
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
              if (Boolean(user) && user.id !== req.body.id) {
                return next('errEmailInUse.', data);
              }
              
              data.user = user;
              next(null, data);
            })
            .catch(() => next('Error on try to check existing user', data));
          },

          // try to update the user.
          (data, next) => {

            Object.assign(data.user, req.body, {
              birthday: req.body.birthday.length > 0 ? req.body.birthday : null
            });

            data.user
            .save({ transaction: data.transaction })
            .then(updatedUser => {
              data.user = updatedUser;
              next(null, data);
            })
            .catch(() => next('Error on try to update user.', data));
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
