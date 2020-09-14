const Bcrypt = require('bcrypt');
const Async = require('async');
const Jwt = require('jsonwebtoken');

const {
  models,
  config
} = require('globals');

module.exports = {
  method: 'post',
  path: '/admins/users/signin',
  validate: {
    body: null,
    query: null
  },
  handler: (req, res) => {
    Async.waterfall([
      // get the user
      next => {
        const query = {
          where: { email: req.body.email }
        };
  
        models.user
        .findOne(query)
        .then(user => {
          user = user || {};
  
          const asciiHash = Buffer.from(user.password || '', 'base64').toString('ascii');
          if (!user || !Bcrypt.compareSync(req.body.password, asciiHash)) {
            return next({ message: 'Credenciais Inválidas', status: 400 });
          }
  
          next(null, { user: user });
        })
        .catch((e) => {
          next({ message: 'Erroa ao buscar usuário', status: 500 });
        });
      },
  
      // add the new login
      (data, next) => {
        data.user.sessionToken = Jwt.sign({
          createdAt: new Date(),
          ownerId: data.user.ownerId,
          userId: data.user.id,
          role: data.user.role,
          remoteAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        }, config.tokenSecret);
  
        data.user.save()
        .then((saveUser) => {
          data.user = saveUser;
          next(null, data);
        })
        .catch(() => next({ message: 'Erro ao atualizar usuário', status: 500 }))
      }
    ], (error, data) => {
      if (error) {
        return res
        .status(error.status)
        .json({ message: error.message });
      }
  
      models.user
      .getRelationshipData({ id: data.user.id })
      .then((result) => res.json(result))
      .catch(e => res.status(e.status).json({ message: e.message }));
    });
  }
};
