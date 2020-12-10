const Async = require('async');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'delete',
  path: '/admins/categories/:id/delete',
  auth: 'common',
  validate: {
    params: { id: schemas.category.id }
  },
  handler: (req, res) => {
    Async.waterfall([
      next => next(null, {
        Op: models.Sequelize.Op
      }),

      // get the existing category
      (data, next) => {
        const query = {
          where: { id: req.params.id }
        };

        models.category
        .findOne(query)
        .then(category => {
          if (!category) {
            return next('errCatNotFound', data);
          }

          data.category = category;
          next(null, data);
        })
        .catch(() => next('Error on try to get category', data));
      },

      // update category
      (data, next) => {
        Object.assign(data.category, req.body, {
          status: 'deleted'
        });

        data.category
        .save()
        .then(category => {
          data.category = category;
          next(null, data);
        })
        .catch(() => next('Error on try to delete category.', data));
      }
    ],
    (error, data) => {
      if (error) {
        return res.status(400).json({ message: error });
      }

      res.json({ id: req.query.id });
    });
  }
};
