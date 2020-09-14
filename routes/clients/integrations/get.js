const {
  models,
} = require('globals');

module.exports = {
  method: 'get',
  path: '/clients/integrations/get',
  auth: 'common',
  handler: (req, res) => {
    const options = {
      where: { ownerId: req.credentials.ownerId },
    };

    models.ownerIntegration
    .find(options)
    .then(integrations => {
      let integration = integrations.find(i => ((i.metadata || {}).apiKey || '').length !== 0);

      if (!integration || integration.metadata.apiKey.length === 0) {
        return res.json({ company: null });
      }

      res.json({ company: integration.company });
    })
    .catch(() => {
      res.status(500).json({ message: 'Error on try to get integration' });
    });
  }
};
