'use strict';

const fs = require('fs');

const AWS = require('aws-sdk');

const config = require('../config');

class Aws {
  constructor(config) {
    AWS.config.update({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region || 'us-east-1'
    });

    this.__s3Bucket = config.s3Bucket;

    const file = fs.readFileSync(__dirname + '/../test.png');

    this.uploadImage(file, 'mypng', 'binary', 'image/png')
    .then(() => console.log('ok'))
    .catch(e => console.log('error:', e));
  }

  sendSMS(msg, number) {
    const params = {
      PhoneNumber: number,
      Message: msg
    };

    return new AWS.SNS({apiVersion: '2010-03-31'})
    .publish(params)
    .promise();
  }

  uploadFile(content, name, path, extraOptions={}) {
    let params = {
      Bucket: this.__s3Bucket + (path ? '/' + path : ''),
      Key: name,
      Body: content,
      ACL: 'public-read'
    };

    Object.assign(params, extraOptions);

    return new AWS.S3({ apiVersion: '2006-03-01' })
    .upload(params)
    .promise();
  }

  uploadImage(content, name, encoding='base64', contentType='image/jpg') {
    return this.uploadFile(content, name, 'images', {
      ContentEncoding: encoding,
      ContentType: contentType,
    });
  }
}

let instance = null;
module.exports = (() => {
  if (!instance) {
    instance = new Aws(config.aws);
  }

  return instance;
})();
