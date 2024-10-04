/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

const joi = require('../services/joi.service');
const {ReE, ReS} = require('../services/util.service');
const usersHelper = require('../helpers/users.helper');
const userFunctions = require("../functions/user.functions");

/*User Register*/
async function newUsers(req, res) {
    const usersDNI = req.body.usersDNI
    const usersPassword = req.body.usersPassword
    const usersEmail = req.body.usersEmail
    const usersPhone = req.body.usersPhone
    const usersName = req.body.usersName
    const usersLastName = req.body.usersLastName
    const usersType = 4

    const result = joi.users.validate({
        usersDNI,
        usersName,
        usersLastName,
        usersEmail,
        usersPassword,
        usersPhone
    });

    if (result.error) {
        let err = result.error.details[0].context.key;
        return ReE(res, err, 400, result);
    }
    try {
        const userExistByEmail = await usersHelper.userExistByEmail(usersEmail)
        const userExistByDNI = await usersHelper.userExistByDNI(usersDNI)

        if (userExistByEmail || userExistByDNI) {
            return ReE(res, "userExist", 400)
        }
        const user = {usersDNI, usersName, usersLastName, usersEmail, usersPassword, usersPhone, usersType}

        const newUsers = await userFunctions.newUsers(user)

        return ReS(res, newUsers.message, 200)
    } catch (e) {
        return ReE(res, "500", 500, e)
    }
}

/*Login Users*/
async function usersLogin(req, res) {
    let usersPassword = req.body.usersPassword;
    let usersEmail = req.body.usersEmail;

    const result = joi.usersLogin.validate({
        usersEmail,
        usersPassword
    });

    if (result.error) {
        let err = result.error.details[0].context.key;
        return ReE(res, err, 400, result);
    }

    try {
        const userExistByEmail = await usersHelper.userExistByEmail(usersEmail)
        if (!userExistByEmail) {
            return ReE(res, "userNotExist", 400)
        }
        if (await usersHelper.userActiveVerification(usersEmail) === 1) {
            return ReE(res, "userNotActive", 400)
        }

        const data = {usersEmail, usersPassword}
        const loginUsers = await userFunctions.login(data)
        return ReS(res, loginUsers.message, 200)

    } catch (e) {
        return ReE(res, "500", 500, e)
    }
}

/*Update User Data*/
async function updateUser(req, res) {
    const userPhone = req.body.userPhone
    const usersName = req.body.usersName
    const usersLastName = req.body.usersLastName
    const usersId = req.user.userId

    const result = joi.usersEdit.validate({
        userPhone,
        usersName,
        usersLastName
    })

    if (result.error) {
        let err = result.error.details[0].context.key
        return ReE(res, err, 400, result)
    }
    try {

        const user = {usersName, usersLastName, userPhone, usersId}
        const updateUsers = await userFunctions.updateUserData(user)

        return ReS(res, updateUsers.message, 200)

    } catch (e) {
        return ReE(res, "500", 500, e)
    }
}

/*Change Password*/
async function changePassword(req, res) {
    const oldPassword = req.body.oldPassword
    const renovatePassword = req.body.renovatePassword
    const usersId = req.user.userId

    const result = joi.changePassword.validate({
        oldPassword,
        renovatePassword
    });
    if (result.error) {
        const err = result.error.details[0].context.key
        return ReE(res, err, 400, result);
    }

    try {
        const changePassword = await userFunctions.updatePassword(oldPassword, renovatePassword, usersId)
        return ReS(res, changePassword.message, 200)
    } catch (e) {
        return ReE(res, "500", 500, e)
    }
}

module.exports = {
    newUsers,
    usersLogin,
    updateUser,
    changePassword
}