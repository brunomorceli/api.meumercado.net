const Joi = require('joi');
const _ = require('lodash');

const {
  models,
} = require('globals');

module.exports = {
  method: 'get',
  path: '/clients/shippings/list',
  auth: 'common',
  handler: (req, res) => {
    const options = {
      where: {
        ownerId: req.credentials.ownerId,
        clientId: req.credentials.userId,
        status: 'active'
      }
    };

    models.userShipping
    .findAll(options)
    .then(list => {
      res.json(list.map(i => models.userShipping.filter(i.toJSON())));
    })
    .catch(() => res.status(500).json({ message: 'Error on try to get shipping list' }));
  }
};
