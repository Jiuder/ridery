const pool = require('../bin/DBconfig')
const returnObject = require("./returns.helpers");

async function userActiveVerification(usersEmail) {
    const verify = await pool.query(`SELECT users.users_id,
                                            users.users_active
                                     FROM users
                                     WHERE users.users_email = ?
                                       AND users.users_active = false`, [usersEmail]);
    return verify.length
}

async function userExistByEmail(usersEmail) {
    let user = await pool.query(`SELECT users_id
                                 from users
                                 where users_email = ?`, [usersEmail]);
    return user.length !== 0;
}

async function userExistByDNI(usersDNI) {
    let user = await pool.query(`SELECT users_id
                                 from users
                                 where users_dni = ?`, [usersDNI]);
    return user.length !== 0;
}

async function usersChangeEmail(email, id) {
    let user = await pool.query(`SELECT users_id
                                 from users
                                 where users_email = ?
                                   AND users.users_id <> ?`, [email, id]);
    return user.length === 0;
}

module.exports = {
    userActiveVerification,
    userExistByEmail,
    userExistByDNI,
    usersChangeEmail
};
