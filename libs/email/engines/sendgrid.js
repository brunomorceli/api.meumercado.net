const sgMail = require('sendgrid').mail;

const config = {
  apiKey: null,
};

module.exports.init = (data) => {
  Object.assign(config, data);

  if (!config.apiKey) {
    throw('[emailRender Error][sendgrid] "config.apiKey" must be informed.');
  }
};

module.exports.send = (data) => {
  return new Promise((resolve, reject) => {
    const fromEmail = new sgMail.Email(data.from);
    const toEmail = new sgMail.Email(data.to);
    const contentEmail = new sgMail.Content(data.contentType, data.content);
    const mail = new sgMail.Mail(fromEmail, data.subject, toEmail, contentEmail);

    const sendgrid = require('sendgrid')(config.apiKey);
    const request = sendgrid.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    sendgrid.API(request, (error, response) => {
      if (error) {
        return reject(error);
      }

      return resolve(response);
    });
  });
};
