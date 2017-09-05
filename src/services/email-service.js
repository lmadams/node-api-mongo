

const config = require('../config');
const sendgrid = require('sendgrid')(config.sendgridKey);

exports.send = async (to, subject, body) => {
  sendgrid.send({
    to,
    from: 'heello@adams.io',
    subject,
    html: body,
  });
};
