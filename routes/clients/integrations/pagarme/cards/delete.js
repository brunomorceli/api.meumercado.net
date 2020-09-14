const Async = require('async');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'delete',
  path: '/clients/integrations/pagarme/cards/:id/delete',
  auth: 'common',
  validate: {
    params: { id: schemas.userCard.id }
  },
  handler: (req, res) => {
    Async.waterfall([
      next => next(null, {
        id: req.params.id,
        userId: req.credentials.userId,
        ownerId: req.credentials.ownerId,
        Op: models.Sequelize.Op
      }),

      // get the existing card
      (data, next) => {
        const query = {
          where: {
            id: data.id,
            userId: data.userId,
            ownerId: data.ownerId
          }
        };

        models.userCard
        .findOne(query)
        .then(card => {
          if (!card) {
            return next('Error on try to find card', data);
          }

          data.card = card;
          next(null, data);
        })
        .catch(() => next('Error on try to get card', data));
      },

      // update card
      (data, next) => {
        data.card.status = 'inactive',

        data.card
        .save()
        .then(card => {
          data.card = card;
          next(null, data);
        })
        .catch(() => next('Error on try to delete card.', data));
      }
    ],
    (error, data) => {
      if (error) {
        return res.status(500).json({ message: error });
      }

      res.json({ id: data.id });
    });
  }
};
