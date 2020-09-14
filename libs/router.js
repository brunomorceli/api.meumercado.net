'use strict';

const path = require('path');
const read = require('fs-readdir-recursive');
const _ = require('lodash');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const express = require('express');

const router = express.Router();

class Router {
  constructor() {
    this.authMdwList = {};
    this.jwtToken = null;
  }

  __getAuthMdw(file) {
    const auth = file.auth;
    if (!Boolean(auth)) { return []; }

    // only one auth middleware
    if (_.isString(auth)) {
      return this.authMdwList[auth] ? [this.authMdwList[auth]] : [];
    }

    // multiple middlewares.
    if (_.isArray(auth)) {
      return auth
      .filter(i => Boolean(this.authMdwList[i]))
      .map(i => this.authMdwList[i]);
    }

    return [];
  }

  __getBodyValidationMdw(file) {
    const method = file.method;
    const validate = file.validate;

    if (!method || !validate || !validate.body) { return []; }
  
    if (['post', 'put'].indexOf(method) < 0) {
      console.error(`method ${method} in route ${file.path} can't use body validation.`);
      return [];
    }
  
    // return the middleware
    return [(req, res, next) => {
      const result = joi.validate(req.body, validate.body);
      if(result.error) {
        return res.status(400).json({
          message: result.error.details[0].message
        });
      }
      next();
    }];
  }
  
  __getQueryValidationMdw(file) {
    const method = file.method;
    const validate = file.validate;
    if (!method || !validate || !validate.query) { return []; }
  
    if (['get', 'delete'].indexOf(method) < 0) {
      console.error(`method [${method}] in route "${file.path}" can't use query validation.`);
      return [];
    }
  
    // return the middleware
    return [(req, res, next) => {
      const result = joi.validate(req.query, validate.query);
      if(result.error) {
        return res.status(400).json({
          message: result.error.details[0].message
        });
      }
      next();
    }];
  }

  __getParamValidationMdw(file) {
    const method = file.method;
    const validate = file.validate;
    if (!method || !validate || !validate.param) { return []; }
  
    if (['get', 'delete'].indexOf(method) < 0) {
      console.error(`method [${method}] in route "${file.path}" can't use param validation.`);
      return [];
    }
  
    // return the middleware
    return [(req, res, next) => {
      const result = joi.validate(req.param, validate.param);
      if(result.error) {
        return res.status(400).json({
          message: result.error.details[0].message
        });
      }
      next();
    }];
  }

  setJwtToken(token) {
    this.jwtToken = token;
  }

  addAuthMiddleware(name, middleware) {
    this.authMdwList[name] = middleware;
  }

  generate(app, basepath=__dirname) {
    const filepathList = read(basepath);
  
    filepathList.forEach(filepath => {
      const file = require(path.join(basepath, filepath));
      let args = [file.path];

      // add all config information from file.
      args.push((req, res, next) => {
        req.config = _.omit(file, 'handler');
        next();
      });

      // get the credentials.
      args.push((req, res, next) => {
        const authHeader = (req.headers['authorization'] || '').replace('Bearer ', '');
        if (!authHeader || authHeader.length === 0 || !this.jwtToken) {
          return next();
        }

        jwt.verify(authHeader, this.jwtToken, (error, credentials) => {
          if (!error && credentials) {
            req.credentials = credentials;
          }
          next();
        });
      });

      args = args.concat(this.__getAuthMdw(file));
      args = args.concat(this.__getBodyValidationMdw(file));
      args = args.concat(this.__getQueryValidationMdw(file));
      args = args.concat(this.__getParamValidationMdw(file));

      args.push(file.handler);

      router[file.method].apply(router, args);

    });

    app.use('/', router);
  }
}

let instance = null;
module.exports = (() => {
  if (!instance) { instance = new Router(); }
  return instance;
})();
