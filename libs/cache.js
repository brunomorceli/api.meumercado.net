'use strict';

const Async = require('async');
const Uuid = require('uuid');
const Redis = require('redis');

class Cache {
  constructor() {
    this.client = Redis.createClient();
  }

  __toJSON(data) {
    if (!data) {
      return null;
    }
    
    let result = null;
    try {
      result = JSON.parse(data);
    }
    catch(e) {
      result = null;
    }
  
    return result;
  }

  get(key, ownerId) {
    return new Promise((resolve, reject) => {
      this.client
      .get(key + '-' + ownerId, (error, result) => {
        if (error) {
          return reject('Error on try to get cache');
        }

        resolve(this.__toJSON(result));
      });
    });
  }

  set(key, ownerId, data) {
    return new Promise((resolve, reject) => {
      const setData = {
        update: Uuid(),
        data: data
      };

      this.client
      .set(key + '-' + ownerId, JSON.stringify(setData), error => {
        if (error) {
          return reject('Error on try to set cache');
        }
        resolve(setData);
      });
    });
  }
  
  drop(key, ownerId) {
    return new Promise((resolve, reject) => {
      this.client
      .del(key + '-' + ownerId, error => {
        if (error) {
          return reject('Error on try to drop cache');
        }
        resolve();
      });
    });
  }
}

let instance = null;
module.exports = (() => {
  if (!instance) {
    instance = new Cache();
  }

  return instance;
})();
