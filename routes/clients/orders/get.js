const Joi = require('joi');
const _ = require('lodash');

const {
  models,
} = require('globals');

module.exports = {
  method: 'get',
  path: '/clients/orders/:id/get',
  auth: 'common',
  handler: (req, res) => {
    const Op = models.Sequelize.Op;
    const options = {
      where: {
        id: req.params.id,
        ownerId: req.credentials.ownerId,
        clientId: req.credentials.userId,
      },
      include: [{
        model: models.orderProduct,
        include: [models.product]
      }]
    };

    console.log(options);

    models.order
    .findOne(options)
    .then(order => {
      if (!order) {
        return res.json(null);
      }
      let orderFiltered = _.omit(order.toJSON(), ['order_products', 'updatedAt']);
      orderFiltered.products = order.order_products.map(op => {
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

      res.json(orderFiltered);
    })
    .catch((k) => {
      console.log(k);
      res.status(500).json({ message: 'Error on try to get orders' });
    });
  }
};
