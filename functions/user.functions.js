/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */
const pool = require("../bin/DBconfig");
const returnObject = require("../helpers/returns.helpers");
const {checkPassword} = require("../services/passwordFormat.service");
const {newPassword} = require("../services/passwordFormat.service");
const {tokensCreated} = require("../services/tokens.service");

/*User Register*/
async function newUsers(user) {
    user.usersPassword = await newPassword(user.usersPassword)

    const {usersDNI, usersName, usersLastName, usersEmail, usersPassword, usersPhone, usersType} = user

    const usersId = await pool.query(`INSERT INTO users (users_dni,
                                                         users_name,
                                                         users_lastname,
                                                         users_email,
                                                         users_password,
                                                         users_phone)
                                          value (?, ?, ?, ?, ?, ?)`, [usersDNI, usersName, usersLastName, usersEmail, usersPassword, usersPhone])

    await pool.query(`INSERT INTO users_types (users_id,
                                               types_id)
                          value (?, ?)`, [usersId.insertId, usersType])

    return returnObject(false, "Success", 200)
}

/*Get User Data*/
async function getUsersData(userId) {
    return await pool.query(`SELECT users.users_dni,
                                    users.users_dni,
                                    users.users_email,
                                    users.users_lastname,
                                    users.users_name,
                                    users.users_balance,
                                    users.users_phone,
                                    tu.types_name,
                                    tu.types_users_id
                             FROM users
                                      INNER JOIN users_types ut on users.users_id = ut.users_id
                                      INNER JOIN types_users tu on ut.types_id = tu.types_users_id
                             where users.users_id = ?`, [userId])
}

/*Get id With Email*/
async function getIdWithEmail(destinationMail) {
    const destination = await pool.query(`SELECT users.users_id
                                          FROM users
                                          where users_email = ?`, [destinationMail])
    return destination[0].users_id
}

/*Get the Token*/
async function getToken(userDNI) {
    const user = await pool.query(`SELECT users.users_id
                                   FROM users
                                   WHERE users.users_dni = ?`, [userDNI]);
    let token = await tokensCreated(user[0].users_id);
    return (token)
}

/*Login*/
async function login(data) {
    const {usersEmail, usersPassword} = data
    const loginVerify = await pool.query(`SELECT users.users_password,
                                                 users.users_email,
                                                 users.users_id,
                                                 users.users_dni
                                          FROM users
                                          where users_email = ?`, [usersEmail])
    const validate = await checkPassword(usersPassword, loginVerify[0].users_password)

    if (validate) {
        return returnObject(false, {
            token: await getToken(loginVerify[0].users_dni),
            usersData: await getUsersData(loginVerify[0].users_id)
        })
    }
    return returnObject(true, 'Password and User combination is invalid', 401);
}

/*Update User Data*/
async function updateUserData(user) {
    const {usersName, usersLastName, userPhone, usersId} = user
    await pool.query(`UPDATE users
                      SET users_name     = ?,
                          users_lastname = ?,
                          users_phone    = ?
                      WHERE users_id = ?`, [usersName, usersLastName, userPhone, usersId]);

    return returnObject(false, {
        usersData: await getUsersData(usersId)
    }, 200)
}

/*Update Password*/
async function updatePassword(oldPassword, renovatePassword, usersId) {
    const verify = await pool.query(`SELECT users.users_password
                                     FROM users
                                     where users_id = ?`, [usersId])

    const password = await newPassword(renovatePassword)

    if (await checkPassword(oldPassword, verify[0].users_password)) {
        await pool.query(`UPDATE users
                          SET users_password = ?
                          WHERE users_id = ?`, [password, usersId]);
        return returnObject(false, 'Success', 200)
    }
    return returnObject(true, 'Incorrect Password', 401);
}

/*Recover Password*/
async function forgotPassword(usersEmail) {
    let user = await pool.query(`SELECT users.usersName, users.usersLastName, users.usersId
                                 from users
                                 WHERE users.usersEmail = ?
                                   AND users.enabled = 1`, [usersEmail]);
    if (user.length) {
        let saldo = await pool.query(`SELECT *
                                      from saldo`);
        saldo = saldo[0]
        let errors;
        let transporter = nodemailer.createTransport({
            pool: true,
            host: "saldo",
            port: 465,
            secure: true, // upgrade later with STARTTLS
            auth: {
                user: "",
                pass: "JUk-[.e8h)S&"
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let token = await tokensCreated(user[0].usersId);
        let tokenN = 'Bearer ' + token;
        await pool.query(`UPDATE users
                          set resettoken = ?
                          where usersId = ?`, [tokenN, user[0].usersId]);
        const email = new Email({
            template: 'reset',
            message: {
                from: '"' + 'Saldo' + '"' + ' <info>',
            },
            transport: transporter,
            send: true,
            preview: false,
        });
        email.send({
            template: 'reset',
            message: {
                from: '"' + 'Saldo' + '"' + ' <info@>',
                to: usersEmail
            },
            locals: {
                name: user[0].usersName,
                vpos: " ",
                address: saldo.address,
                website: saldo.email,
                phone: saldo.phone,
                correo: saldo.email,
                token: token,
                token2: token,
                token3: token
            },
        }).then((success) => {
        }).catch(
            (error) => {
                errors = error;
                console.log(error)
            }
        ).finally(() => {
            transporter.close()
        })
        if (errors) {
            console.log(errors)
            return '1';
        }
        return true;
    }
    return true
}

module.exports = {
    newUsers,
    login,
    getIdWithEmail,
    updateUserData,
    updatePassword
};