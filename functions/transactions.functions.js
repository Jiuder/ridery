/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */
const pool = require("../bin/DBconfig");
const returnObject = require("../helpers/returns.helpers");
const transactionReference = require("../helpers/transactions.helpers");
const usersFunctions = require("./user.functions.js");
const Pag = require("../helpers/pagination.helper");
const {checkPassword} = require("../services/passwordFormat.service");

/*Transaction History*/
async function getTradingHistory(page, userId) {
    const numberTransactions = await pool.query(`SELECT COUNT(transactions.transactions_id) as number
                                                 FROM transactions
                                                          INNER JOIN movements_type
                                                                     ON transactions.transaction_type = movements_type.movements_type_id
                                                          INNER JOIN transactions_status
                                                                     ON transactions.transaction_status =
                                                                        transactions_status.transactions_status_id
                                                          INNER JOIN users
                                                                     ON transactions.user_receive = users.users_id
                                                 WHERE user_sending = ?
                                                    OR user_receive = ?`, [userId, userId])

    let current = numberTransactions[0].number

    let pagination = await Pag.pagination(page, current);
    console.log(numberTransactions)
    if (!current) {
        return {
            transactionList: [],
            pagination
        }
    }
    const transactionList = await pool.query(`SELECT transactions_status.status_name,
                                                     transactions.*,
                                                     users.users_name,
                                                     movements_type.*,
                                                     users.users_lastname
                                              FROM transactions
                                                       INNER JOIN movements_type
                                                                  ON transactions.transaction_type = movements_type.movements_type_id
                                                       INNER JOIN transactions_status
                                                                  ON transactions.transaction_status =
                                                                     transactions_status.transactions_status_id
                                                       INNER JOIN users
                                                                  ON transactions.user_receive = users.users_id
                                              WHERE (user_sending = ?
                                                  AND transaction_type = ?)
                                                 OR (user_receive = ?
                                                  AND transaction_type = ?)
                                              LIMIT ?, ? `, [userId, 2, userId, 1, ((page - 1) * Pag.limit), Pag.limit])

    return {transactionList, pagination};
}

/*Check Balance*/
async function checkBalance(usersId) {
    const balance = await pool.query(`SELECT users.users_balance
                                      FROM users
                                      where users_id = ? `, [usersId])
    return balance[0].users_balance
}

/*Transfer*/
async function transfer(usersId, destinationMail, transferAmount) {

    const receiverId = await usersFunctions.getIdWithEmail(destinationMail)
    let transactionType
    let transmitter = await checkBalance(usersId)
    let receiver = await checkBalance(receiverId)

    const transactionStatus = 1
    transmitter = transmitter - transferAmount
    receiver = receiver + transferAmount

    let referenceCode = await validationReferenceCode()

    await pushTransfer(transmitter, usersId)
    await pushTransfer(receiver, receiverId)

    transactionType = 1
    let transactionId = await insertTransactions(receiverId, usersId, transferAmount, transactionType, referenceCode, transactionStatus)
    await insertUsersMovements(receiverId, transferAmount, transactionType, referenceCode, transactionStatus, transactionId)

    transactionType = 2
    transactionId = await insertTransactions(receiverId, usersId, transferAmount, transactionType, referenceCode, transactionStatus)
    await insertUsersMovements(usersId, transferAmount, transactionType, referenceCode, transactionStatus, transactionId)

    return ({
        status: "Success",
        referenceCode: referenceCode,
        transferAmount: transferAmount,
        destinationMail: destinationMail
    })
}

/*Validation Reference Code*/
async function validationReferenceCode() {

    let referenceCode = transactionReference()

    const validation = await pool.query(`SELECT transactions.transaction_code
                                         FROM transactions
                                         where transaction_code = ?`, [referenceCode])

    if (validation.length) {
        await validationReferenceCode();
    } else {
        return referenceCode
    }
}

/*Upload the Transfer*/
async function pushTransfer(balance, usersId) {
    await pool.query(`UPDATE users
                      SET users_balance = ?
                      WHERE users_id = ?`, [balance, usersId]);
}

/*Insert to Transactions*/
async function insertTransactions(usersIdGet, usersIdSet, transferAmount, transactionType, referenceCode, transactionStatus) {
    await pool.query(`INSERT INTO transactions
                      (user_receive, user_sending, transaction_amount, transaction_type, transaction_code,
                       transaction_status)
                      VALUES (?, ?, ?, ?, ?, ?)`, [usersIdGet, usersIdSet, transferAmount, transactionType, referenceCode, transactionStatus])

    const transactionId = await pool.query(`SELECT transactions_id
                                            FROM transactions
                                            where transaction_code = ?`, [referenceCode])
    return transactionId[0].transactions_id
}

/*Insert to Users Movements*/
async function insertUsersMovements(usersId, transferAmount, transactionType, referenceCode, transactionStatus, transactionId) {
    await pool.query(`INSERT INTO users_movements
                      (users_id, movement_amount, movement_type, movement_code, movement_status, transaction_id)
                      VALUES (?, ?, ?, ?, ?, ?)`, [usersId, transferAmount, transactionType, referenceCode, transactionStatus, transactionId])
}

/*Balance Transfer*/
async function balanceTransfer(data) {
    const {transferAmount, destinationMail, usersPassword, usersId} = data

    const verifyPassword = await pool.query(`SELECT users.users_password
                                             FROM users
                                             where users_id = ?`, [usersId])
    if (await checkPassword(usersPassword, verifyPassword[0].users_password)) {

        return returnObject(false, await transfer(usersId, destinationMail, transferAmount), 200)
    }
    return returnObject(true, 'Password is invalid', 401);
}

/*Get type Client*/
async function getTypeClient(usersId) {
    const validationClient = await pool.query(`SELECT users_types.types_id
                                               FROM users_types
                                               where users_id = ?`, [usersId])
    return (validationClient[0].types_id)
}

module.exports = {
    getTradingHistory,
    balanceTransfer,
    checkBalance,
    getTypeClient
}