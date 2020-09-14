const { models } = require('globals');

module.exports = {
  method: 'get',
  path: '/admins/companies/:id/get',
  auth: 'common',
  validate: {
    body: null,
    query: null
  },
  handler: (req, res) => {
    const query = {
      where: { status: 'active' },
      include: [
        {
          model: models.userCompany,
          where: { userId: req.credentials.ownerId },
          required: true
        }
      ]
    };
  
    models.company
    .findOne(query)
    .then(company => res.json({
      id: company.id,
      name: company.name
    }))
    .catch(() => res.status(500).json({ message: 'Error on try to get company'}));
  }
};
