/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

const Joi = require('joi')
    .extend(require('@joi/date'));

const users = Joi.object().keys({
    usersDNI: Joi.number().min(3).required(),
    usersName: Joi.string().min(2).required(),
    usersLastName: Joi.string().min(2).required(),
    usersEmail: Joi.string().email({minDomainSegments: 2}).required(),
    usersPhone: Joi.string().required(),
    usersPassword: Joi.string().min(8).required()
})

const usersLogin = Joi.object().keys({
    usersEmail: Joi.string().email({minDomainSegments: 2}).required(),
    usersPassword: Joi.string().min(8).required()
})

const sendBalance = Joi.object().keys({
    transferAmount: Joi.number().min(0).max(5).required(),
    destinationMail: Joi.string().email({minDomainSegments: 2}).required(),
    usersPassword: Joi.string().min(8).required()
})

const usersEdit = Joi.object().keys({
    usersName: Joi.string().min(2).required(),
    usersLastName: Joi.string().min(2).required(),
    userPhone: Joi.string().required(),
})

const changePassword = Joi.object().keys({
    oldPassword: Joi.string().min(8).required(),
    renovatePassword: Joi.string().min(8).required()
})

module.exports = {
    users,
    usersLogin,
    sendBalance,
    usersEdit,
    changePassword
};


