const _ = require('lodash');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'get',
  path: '/admins/users/:id/get',
  auth: 'common',
  validate: {
    query: { id: schemas.user.id }
  },
  handler: (req, res) => {
    const query = {
      where: {
        ownerId: req.credentials.ownerId,
        id: req.params.id,
        status: 'active'
      }
    };

    models.user
    .findAll(query)
    .then(users => 
      res.json(
        users.map(u => _.pick(u, [
          'id', 
          'email',
          'firstName',
          'lastName'
        ])
      )
    ))
    .catch(() => 
      res.status(500).json({ message: 'Error on try to get users'})
    );
  }
};
