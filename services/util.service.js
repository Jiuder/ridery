/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

const {to} = require('await-to-js');
const pe = require('parse-error');
const {getAppData} = require("../helpers/app.helper");
const {messagesMap} = require('../helpers/messages.helper');

module.exports.to = async (promise) => {
    let err, res;
    [err, res] = await to(promise);
    if (err) return [pe(err)];
    return [null, res];
};

module.exports.ReE = function (res, err, code, e) { // Error Web Response
    if ((typeof err == 'object' || typeof err == 'string') && typeof err.message != 'undefined') {
        err = err.message;
    }
    if ((code === 500 || code === 400) && e) {
        console.log(e)
    }
    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json({success: false, message: messagesMap[err] ? messagesMap[err] : messagesMap[500]});
};

module.exports.ReS = function (res, requestData, code = 200) { // Success Web Response
    let success = true;
    if (typeof code !== 'undefined') {
        res.statusCode = code;
    }
    const appData = getAppData();
    if (appData && appData.hasOwnProperty('maintenanceMode')) {
        if (appData.maintenanceMode) {
            code = 207
        }
    }
    return res.status(code).send({
        success,
        appData,
        data: requestData

    });
};

module.exports.TE = TE = function (err_message, log) { // TE stands for Throw Error
    if (log === true) {
        console.error(err_message);
    }
    throw new Error(err_message);
};
