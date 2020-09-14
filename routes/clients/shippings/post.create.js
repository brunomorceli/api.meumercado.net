const Uuid = require('uuid');
const _ = require('lodash');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'post',
  path: '/clients/shippings/create',
  auth: 'common',
  validate: { body: _.omit(schemas.userShipping, [
    'id',
    'ownerId',
    'clientId',
    'status',
    'createdAt',
    'updatedAt'
]) },
  handler: (req, res) => {
    const registryData = Object.assign({}, req.body, {
      id: Uuid(),
      clientId: req.credentials.userId,
      ownerId: req.credentials.ownerId,
      status: 'active'
    });

    models.userShipping
    .create(registryData)
    .then(result => res.json(models.userShipping.filter(result.toJSON())))
    .catch((k) => {
      console.log(k);
      res.status(500).json({ message: 'Error on try to create shipping.'});
    });
  }
};
