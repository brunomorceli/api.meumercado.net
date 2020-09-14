const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'get',
  path: '/admins/products/:id/get',
  auth: 'common',
  validate: {
    query: { id: schemas.product.id }
  },
  handler: (req, res) => {
    const query = {
      where: {
        ownerId: req.credentials.ownerId,
        id: req.params.id,
        status: 'active'
      }
    };

    models.product
    .findAll(query)
    .then(products => 
      res.json(products.map(u => models.product.filter(u)))
    )
    .catch(() => 
      res.status(500).json({ message: 'Error on try to get products'})
    );
  }
};
