const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'get',
  path: '/clients/categories/get',

  validate: {
    query: {
      id: schemas.category.id,
      ownerId: schemas.category.ownerId
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

    models.category
    .findOne(query)
    .then(result => 
      res.json(models.category.filter(result))
    )
    .catch(() => {
      res.status(500).json({ message: 'Error on try to get category'});
    });
  }
};
