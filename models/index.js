'use strict';

const Fs = require("fs");
const Path = require("path");
const Sequelize = require("sequelize");
const config = require('../config');
const utils = require('../libs/utils');

const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = {};

Fs
.readdirSync(__dirname)
.filter(function(file) {
  return (file.indexOf(".") !== 0) && (file !== "index.js");
})
.forEach(function(file) {
  var model = sequelize.import(Path.join(__dirname, file));
  
  db[utils.snakeToCamel(model.name)] = model;
});

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
