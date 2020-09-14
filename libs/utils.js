const Path = require('path');
const Fs = require('fs');
const Normalize = require('normalize-strings');

module.exports.userStatus = (user) => {
  if (user.confirmToken && user.confirmToken.length) {
    return 'confirm';
  }

  if (user.resetPwdToken && user.resetPwdToken.length) {
    return 'resetPassword';
  }

  return 'complete';
};

module.exports.kebabToCamel = (expression) => {
  return expression.replace(/-([a-z])/g, (g) => {
    return g[1].toUpperCase();
  });
};

module.exports.camelToKebab = (expression) => {
  return expression.replace(/([a-z][A-Z])/g,  (g) => {
    return g[0] + '-' + g[1].toLowerCase();
  });
};

module.exports.snakeToCamel = (expression) => {
  return expression.replace(/_([a-z])/g, (g) => {
    return g[1].toUpperCase();
  });
};

module.exports.validateCommonToken = (decoded, request, callback) => {
  if (!decoded.ownerId || !decoded.userId) { return callback(null, false); }

  const models = require('global').models;

  models.user
  .findOne({
    where: { id: decoded.userId },
  })
  .then((user) => {
    if (!user) { return callback(null, false); }
    decoded.user = user;

    callback(null, true, decoded);
  })
  .catch(() => callback(null, false));
};

module.exports.getTLS = (key, certificate) => {
  const keyPath = Path.join(__dirname, '..', 'ssl', (key || 'key.pem'));
  const certPath = Path.join(__dirname, '..', 'ssl', (certificate || 'certificate.pem'));

  if (!Fs.existsSync(keyPath) || !Fs.existsSync(certPath)) {
    return null;
  }

  return {
    key: Fs.readFileSync(keyPath),
    cert: Fs.readFileSync(certPath),
  };
};


module.exports.toSearchText = (text) => {
  return Normalize(text || '')
  .replace(/[^a-zA-Zs]/g, '')
  .toLowerCase();
};