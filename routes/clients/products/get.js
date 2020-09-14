const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'get',
  path: '/clients/products/get',

  validate: {
    query: {
      id: schemas.product.id,
      ownerId: schemas.product.ownerId
    }
  },
  handler: (req, res) => {
    const Op = models.Sequelize.Op;
    const query = {
      where: {
        id: req.query.id,
        ownerId: req.query.ownerId,
        status: { [Op.ne]: 'deleted' }
      }
    };

    models.product
    .findOne(query)
    .then(result => 
      res.json(models.product.filter(result))
    )
    .catch(() => {
      res.status(500).json({ message: 'Error on try to get product'});
    });
  }
};
