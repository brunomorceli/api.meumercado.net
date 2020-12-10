const Async = require('async');
const _ = require('lodash');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'put',
  path: '/admins/categories/update',
  auth: 'common',
  validate: {
    body: _.pick(schemas.category, [
      'id',
      'companyId',
      'name',
      'thumbnail'
    ])
  },
  handler: (req, res) => {
    Async.waterfall([
      next => next(null, {
        Op: models.Sequelize.Op
      }),

      // check if the category already exists.
      (data, next) => {
        const query = {
          where: {
            id: { [data.Op.ne]: req.body.id },
            companyId: req.body.companyId,
            name: { [data.Op.iLike]: req.body.name },
            status: 'active',
          }
        };

        models.category
        .findOne(query)
        .then(category => next(Boolean(category) ? 'errCatInUse.' : null, data))
        .catch(() => next('Error on try to check existing category', data));
      },

      // get the existing category
      (data, next) => {
        const query = {
          where: {
            id: req.body.id,
            companyId: req.body.companyId
          }
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
          status: 'active'
        });

        data.category
        .save()
        .then(category => {
          data.category = category;
          next(null, data);
        })
        .catch(() => next('Error on try to update category.', data));
      }
    ],
    (error, data) => {
      if (error) {
        return res.status(400).json({ message: error });
      }

      res.json(models.category.filter(data.category));
    });
  }
};
