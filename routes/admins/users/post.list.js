const _ = require('lodash');
const Joi = require('joi');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'post',
  path: '/admins/users/list',
  auth: 'common',
  validate: {
    body: {
      updateNumber: Joi.string().optional(),
      status: schemas.user.status,
      in: Joi.array().items(schemas.user.status).optional(),
    }
  },
  handler: (req, res) => {
    const Op = models.Sequelize.Op;
    const query = {
      where: {
        ownerId: req.credentials.ownerId,
        status: 'active'
      }
    };

    if (req.body.status) {
      query.where.status = req.body.status;
    }
    else if (req.body.in && req.body.in.length !== 0) {
      query.where.status = { [Op.in]: req.body.in };
    }

    models.user
    .findAll(query)
    .then(users => 
      res.json(
        users.map(u => _.pick(u, [
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
      )
    ))
    .catch(() => 
      res.status(500).json({ message: 'Error on try to get users'})
    );
  }
};
