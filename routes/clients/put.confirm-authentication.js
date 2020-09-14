const Async = require('async');
const Jwt = require('jsonwebtoken');
const Joi = require('joi');
const {
  models,
  config
} = require('globals');

module.exports = {
  method: 'put',
  path: '/clients/confirm-authentication',
  validate: {
    body: { confirmation: Joi.string().trim().regex(/^[0-9]+$/).length(5) },
  },
  handler: (req, res) => {
    Async.waterfall([
      next => next(null, {
        user: null
      }),

      // get the user
      (data, next) => {
        const query = {
          where: { confirmToken: req.body.confirmation }
        };
  
        models.user
        .findOne(query)
        .then(user => {
          if (!user) {
            return next({ message: 'Invalid credentials', status: 400 }, data);
          }

          data.user = user;
          next(null, data);
        })
        .catch((e) => {
          console.log(e);
          next({ message: 'Error on try to find user', status: 500 }, data);
        });
      },
  
      // add the new login
      (data, next) => {
        data.user.sessionToken = Jwt.sign({
          createdAt: new Date(),
          ownerId: data.user.ownerId,
          userId: data.user.id,
          role: 'client',
          remoteAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        }, config.tokenSecret);

        if (data.user.status === 'pending') {
          data.user.status = 'active';
          data.user.confirmToken = null;
        }
  
        data.user.save()
        .then((saveUser) => {
          data.user = saveUser;
          next(null, data);
        })
        .catch(() => next({ message: 'Error on try to update user', status: 500 }))
      }
    ], (error, data) => {
      if (error) {
        return res
        .status(error.status)
        .json({ message: error.message });
      }

      res.json({
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        token: data.user.sessionToken
      });
    });
  }
};
