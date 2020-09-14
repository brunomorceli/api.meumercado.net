const _ = require('lodash');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'get',
  path: '/admins/categories/:id/get',
  auth: 'common',
  validate: {
    query: { id: schemas.category.id }
  },
  handler: (req, res) => {
    const query = {
      where: {
        ownerId: req.credentials.ownerId,
        id: req.params.id,
        status: 'active'
      }
    };

    models.category
    .findAll(query)
    .then(categories => {
      res.json(categories.map(u => models.categories.filter(u)));
    })
    .catch(() => 
      res.status(500).json({ message: 'Error on try to get categories'})
    );
  }
};
