const { models } = require('globals');

module.exports = {
  method: 'get',
  path: '/clients/integrations/pagarme/cards/list',
  auth: 'common',
  handler: (req, res) => {
    const options = {
      where: {
        ownerId: req.credentials.ownerId,
        userId: req.credentials.userId,
        company: 'pagarme',
        status: 'active'
      }
    };

    models.userCard
    .findAll(options)
    .then(list => res.json(list.map(i => models.userCard.filter(i))))
    .catch(() => res.status(500).json({ message: 'Error on try to get card list' }));
  }
};
