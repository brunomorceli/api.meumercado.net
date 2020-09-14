'use strict';

const Bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDv4,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: true,
      defaultValue: null,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING(256),
      field: 'first_name',
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING(256),
      field: 'last_name',
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(256),
      field: 'description',
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      field: 'phone_number',
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false,
      defaultValue: 'male',
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: 'en'
    },
    sessionToken: {
      type: DataTypes.STRING(1024),
      field: 'session_token',
      allowNull: true,
    },
    confirmToken: {
      type: DataTypes.STRING(5),
      field: 'confirm_token',
      allowNull: true,
    },
    resetPwdToken: {
      type: DataTypes.STRING(16),
      field: 'reset_pwd_token',
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(['owner', 'admin', 'user', 'client']),
      allowNull: false,
      defaultValue: 'client'
    },
    status: {
      type: DataTypes.ENUM(['inviting', 'active', 'inactive', 'pending', 'cancelled']),
      allowNull: false,
      defaultValue: 'active'
    },
  }, {
    instanceMethods: {
      setPassword: password => {
        this.password = Bcrypt.hashSync(password, 10);
      }
    }
  });

  model.getRelationshipData = (where, omit=[]) => {
    return new Promise((resolve, reject) => {
      const query = {
        where: where,
        include: [
          sequelize.models.user_permission,
          sequelize.models.user_company
        ]
      };

      model
      .findOne(query)
      .then(user => {
        if (!user) {
          return reject({
            message: 'User not found',
            code: 400
          });
        }

        let response = {
          id: user.id,
          email: user.email,
          ownerId: user.ownerId,
          firstName: user.firstName,
          lastName: user.lastName,
          description: user.description,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          birthday: user.birthday,
          language: user.language,
          role: user.role,
          permissions: user.user_permissions.map(i => i.permissionId),
          companies: user.user_companies.map(i => i.companyId),
          token: user.sessionToken
        };

        if(_.isArray(omit) && omit.length !== 0) {
          response = _.omit(response, omit);
        }

        resolve(response);
      })
      .catch(() => reject({
        message: 'Error on get user data',
        code: 500
      }));
    });
  };

  model.associate = function(models) {
    model.belongsTo(models.user, {
      as: 'owner',
      foreignKey: { allowNull: true }
    });

    model.hasMany(models.userPermission);
  };

  model.generateConfirmToken = () => {
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += ~~(Math.random() * 10);
    }

    return result;
  }

  return model;
};
