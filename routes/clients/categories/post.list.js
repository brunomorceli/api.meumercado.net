const Async = require('async');

const {
  libs,
  models,
  schemas
} = require('globals');

module.exports = {
  method: 'post',
  path: '/clients/categories/list',
  validate: {
    body: {
      ownerId: schemas.category.ownerId,
      update: schemas.category.id.allow(null)
    }
  },
  handler: (req, res) => {
    Async.waterfall([
      next => next(null, {
        update: req.body.update,
        ownerId: req.body.ownerId,
        cache: null,
        dbData: null
      }),

      // get data from cache
      (data, next) => {
        if (!data.update) {
          return next(null, data);
        }

        libs.cache
        .get('categories', data.ownerId)
        .then(cache => {
          data.cache = cache;
          next(null, data);
        })
        .catch(e => next(e, data));     
      },

      // get data from database
      (data, next) => {
        if (data.cache !== null) {
          return next(null, data);
        }

        const Op = models.Sequelize.Op;
        const query = {
          where: {
            ownerId: req.body.ownerId,
            status: { [Op.ne]: 'deleted' }
          }
        };
    
        models.category
        .findAll(query)
        .then(result => {
          data.dbData = result.map(i => models.category.filter(i));
          next(null, data);
        })
        .catch((e) => {
          console.log(e);
          next('Error on try get category list', data);
        });
      },

      (data, next) => {
        if (data.cache !== null) {
          return next(null, data);
        }

        libs.cache
        .set('categories', data.ownerId, data.dbData)
        .then(cache => {
          data.cache = cache;
          next(null, data);
        })
        .catch(e => next(e, data));
      }
    ], (error, data) => {
      if (error) {
        res
        .status(500)
        .json({ message: 'Error on try to get categories' });
        return;
      }

      res.json({
        update: data.cache.update,
        data: data.update !== data.cache.update ? data.cache.data : null
      });
    });
  }
};
