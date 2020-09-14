const Uuid = require('uuid');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'get',
  path: '/admins/integrations/pagarme/get',
  auth: 'common',
  handler: (req, res) => {
    const query = {
      where: {
        ownerId: req.credentials.ownerId,
        company: 'pagarme',
      },
      defaults: {
        id: Uuid(),
        ownerId: req.credentials.ownerId,
        company: 'pagarme',
        metadata: { apiKey: null }
      },
      returning: true
    };

    models.ownerIntegration
    .findOrCreate(query)
    .then(result => res.json(models.ownerIntegration.filter(result[0].toJSON())))
    .catch((k) => {
      console.log(k);
      res.status(500).json({ message: 'Error on try to get owner integration'});
    });
  }
};
