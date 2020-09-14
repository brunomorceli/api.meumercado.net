const Joi = require('joi');
const _ = require('lodash');

const {
  models,
} = require('globals');

module.exports = {
  method: 'post',
  path: '/clients/orders/list',
  auth: 'common',
  validate: {
    body: {
      offset: Joi.number().min(0).optional(),
      limit: Joi.number().min(1).optional()
    }
  },
  handler: (req, res) => {
    const Op = models.Sequelize.Op;
    const options = {
      where: {
        ownerId: req.credentials.ownerId,
        clientId: req.credentials.userId,
        status: { [Op.ne]: 'deleted' }
      },
      include: [{
        model: models.orderProduct,
        include: [models.product]
      }],
      offset: req.body.offset || 0,
      limit: req.body.limit || 50,
      order: [['createdAt', 'DESC']]
    };

    models.order
    .findAll(options)
    .then(orders => {

      res.json(orders.map(order => {
        const obj = _.omit(order.toJSON(), ['order_products', 'updatedAt']);
        obj.products = order.order_products.map(op => {
          return {
            id: op.product.id,
            price: op.price,
            quantity: op.quantity,
            amount: op.amount,
            name: op.product.name,
            description: op.product.description,
            images: []
          };
        });

        return obj;
      }));
    })
    .catch(() => res.status(500).json({ message: 'Error on try to get orders' }));
  }
};
