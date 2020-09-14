'use strict';

const AWS = require('aws-sdk');

const config = require('../config');

class Aws {
  constructor(config) {
    AWS.config.update({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region || 'us-east-1'
    });
  }

  sendSMS(msg, number) {
    var params = {
      PhoneNumber: number,
      Message: msg
    };

    return new AWS.SNS({apiVersion: '2010-03-31'})
    .publish(params)
    .promise();
  }
}

let instance = null;
module.exports = (() => {
  if (!instance) {
    instance = new Aws(config.aws);
  }

  return instance;
})();
