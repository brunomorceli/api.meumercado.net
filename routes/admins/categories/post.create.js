const Async = require('async');
const _ = require('lodash');
const Uuid = require('uuid');

const {
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'post',
  path: '/admins/categories/create',
  auth: 'common',
  validate: {
    body: _.pick(schemas.category, [
      'companyId',
      'name',
      'thumbnail'
    ])
  },
  handler: (req, res) => {
    Async.waterfall([
      next => next(null, {
        companyId: req.body.companyId,
        Op: models.Sequelize.Op
      }),
      
      // check if the category already exists.
      (data, next) => {
        const query = {
          where: {
            companyId: data.companyId,
            name: { [data.Op.iLike]: req.body.name },
            status: 'active',
          }
        };

        models.category
        .findOne(query)
        .then(category => next(Boolean(category) ? 'errCatInUse.' : null, data))
        .catch(e => next('Error on try to check existing category', data));
      },

      // try to create the category.
      (data, next) => {
        const categoryData = Object.assign(req.body, {
          id: Uuid(),
          status: 'active'
        });

        models.category
        .create(categoryData)
        .then(newCategory => {
          data.category = newCategory;
          next(null, data);
        })
        .catch(() => next('Error on try to create category.', data));
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
