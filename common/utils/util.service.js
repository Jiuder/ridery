const { to } = require('await-to-js');
const pe = require('parse-error');
const { getAppData } = require('../helpers/app.helper');

module.exports.to = async (promise) => {
  const [err, res] = await to(promise);
  if (err) return [pe(err)];
  return [null, res];
};

module.exports.ReE = function (res, err, code, e) {
  if (
    (typeof err === 'object' || typeof err === 'string') &&
    typeof err.message !== 'undefined'
  ) {
    err = err.message;
  }
  if (typeof code !== 'undefined') res.statusCode = code;

  return res.json({ success: false, message: err });
};

module.exports.ReS = function (res, requestData, code = 200) {
  const success = true;
  if (typeof code !== 'undefined') {
    res.statusCode = code;
  }
  const appData = getAppData();

  return res.status(code).send({
    success,
    appData,
    data: requestData,
  });
};

// eslint-disable-next-line no-undef
module.exports.TE = TE = function (errMessage, log) {
  if (log === true) {
    console.error(errMessage);
  }
  throw new Error(errMessage);
};
