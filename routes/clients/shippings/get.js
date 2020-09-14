const {
  models,
} = require('globals');

module.exports = {
  method: 'get',
  path: '/clients/shippings/:id/get',
  auth: 'common',
  handler: (req, res) => {
    const options = {
      where: {
        id: req.params.id,
        clientId: req.credentials.userId,
      }
    };

    models.userShipping
    .findOne(options)
    .then(item => res.json(models.userShipping.filter(item)))
    .catch(() => {
      res.status(500).json({ message: 'Error on try to get shippment' });
    });
  }
};
