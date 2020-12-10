const _ = require('lodash');

const { models } = require('globals');

module.exports = {
  method: 'get',
  path: '/admins/users/list',
  handler: (req, res) => {
    const query = {
      where: { status: 'active' }
    };

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
