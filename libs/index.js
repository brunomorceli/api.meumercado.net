'use strict';

const Fs = require('fs');
const Path = require('path');

const libs = {};

Fs
.readdirSync(__dirname)
.filter(function(file) {
  return (file !== 'index.js');
})
.forEach(function(file) {
  libs[file.replace('.js', '')] = require(Path.join(__dirname, file));
});

module.exports = libs;
