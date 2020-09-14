const _ = require('lodash');
const Async = require('async');
const Uuid = require('uuid');

const {
  models,
  schemas,
  libs
} = require('globals');

module.exports = {
  method: 'post',
  path: '/admins/companies/create',
  auth: 'common',
  validate: {
    body: _.pick(schemas.company, [
      'label',
      'address',
      'number',
      'district',
      'city',
      'state',
      'zipcode',
      'country',
      'status'
    ])
  },
  handler: (req, res) => {

    models.sequelize
    .transaction((transaction) => {
      return new Promise((resolve, reject) => {
        Async.waterfall([
          next => next(null, {
            transaction: transaction,
            Op: models.Sequelize.Op,
            searchText: libs.utils.toSearchText(req.body.label)
          }),

          // try to find a existing company
          (data, next) => {
            const query = {
              where: {
                search: data.searchText,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
                status: { [data.Op.ne]:  'deleted' }
              }
            };

            models.company
            .findOne(query, { transaction: data.transaction })
            .then(company => {
              if (Boolean(company)) {
                return next({
                  code: 400,
                  message: 'O nome escolhido está em uso.'
                });
              }

              next(null, data);
            })
            .catch(() => next({
              code: 500,
              message: 'Erro ao tentar buscar empresa existente.'
            }));
          },

          // try to create the company
          (data, next) => {
            const registryData = Object.assign(req.body, {
              id: Uuid(),
              search: data.searchText,
              ownerId: req.credentials.userId
            });

            models.company
            .create(registryData, { transaction: data.transaction })
            .then(company => {
              data.company = company;
              next(null, data);
            })
            .catch((k) => next({
              code: 500,
              message: 'Erro ao tentar criar nova empresa.'
            }));
          },

          // try to create the user company
          (data, next) => {
            const registryData = {
              id: Uuid(),
              permissions: {},
              status: 'active',
              userId: req.credentials.userId,
              companyId: data.company.id
            };

            models.userCompany.create(registryData, { transaction: data.transaction })
            .then(() => next(null, data))
            .catch(() => next({
              code: 500,
              message: 'Erro ao tentar criar usuário.'
            }));
          }
        ], (error, data) => error ? reject(error) : resolve(data)); // end waterfall
      }); // end promise
    })
    .then(data => res.json(models.company.filter(data.company)))
    .catch(error => res.status(error.code).json({ message: error.message }));
  }
};
