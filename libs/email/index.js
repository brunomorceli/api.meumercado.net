const Fs = require('fs');
const Path = require('path');
const Ejs = require('ejs');
const _ = require('lodash');

let config = {
  engine: 'sendgrid',
  templatePath: null,
  from: null,
  contentType: 'html',
  credentials: null,
};

function checkSendData(data) {
  if (!_.isObject(data)) {
    return '[emailRender Error] - param "data" must be an "Object" type.';
  }

  if (!data.from && !config.from) {
    return '[emailRender Error] param "data.from" must be informed.';
  }

  if (!data.to) {
    return 'param "data.to" must be informed.';
  }

  if (!data.subject) {
    return 'param "data.subject" must be informed.';
  }

  if (!data.template) {
    return '[emailRender Error] param "data.template" must be informed.';
  }

  const templatePath = Path.join(config.templatePath, data.template);
  if (!Fs.existsSync(templatePath)) {
    return `[emailRender Error] param template "${data.template}" not found.`;
  }

  const templateContentPath = Path.join(templatePath, config.contentType + '.ejs');
  if (!Fs.existsSync(templateContentPath)) {
    return `[emailRender Error] param template file "${data.template}/${config.contentType}.ejs" not found.`;
  }

  return null;
}

module.exports.init = (data) => {
  config = Object.assign(config, data);

  if (!Fs.existsSync(config.templatePath)) {
    console.error(`[emailRender Error] template path "${config.templatePath}" not exists.`);
  }

  const enginePath = Path.join(__dirname, 'engines', config.engine + '.js');
  if (!Fs.existsSync(enginePath)) {
    console.error(`[emailRender Error] engine "${config.engine}" not exists.`);
  }

  if (!_.isObject(data.credentials)) {
    console.error(`[emailRender Error] engine "${config.credentials}" must be an "Object" type.`);
  }

  config.engine = require(enginePath);
  config.engine.init(data.credentials);
};

module.exports.send = (data) => {
  return new Promise((resolve, reject) => {
    const dataError = checkSendData(data);
    if (dataError) {
      return reject({ error: dataError });
    }

    const contentPath = Path.join(config.templatePath, data.template, config.contentType + '.ejs');
    const buffer = Fs.readFileSync(contentPath, 'utf8');
    const content = Ejs.render(buffer, data.params || {});

    if (!content) {
      return reject('[emailRender Error] Error on try to render content.');
    }

    const sendData = Object.assign(data, {
      content: content,
      from: data.from || config.from,
      contentType: `text/${config.contentType}`,
    });

    config.engine
    .send(sendData)
    .then(() => resolve({}))
    .catch((error) => reject(error));
  });
};
