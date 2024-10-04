const transactionFunction = require("../functions/transactions.functions");
const joi = require("../services/joi.service");
const usersHelper = require("../helpers/users.helper");
const {ReS} = require("../services/util.service");
const {ReE} = require("../services/util.service");

/*Execute the Transfer*/
async function transfer(req, res) {
    const transferAmount = req.body.transferAmount
    const destinationMail = req.body.destinationMail
    const usersPassword = req.body.usersPassword
    const usersId = req.user.userId

    const result = joi.sendBalance.validate({
        transferAmount,
        destinationMail,
        usersPassword
    });
    if (result.error) {
        let err = result.error.details[0].context.key
        return ReE(res, err, 400, result)
    }

    const userExistByEmail = await usersHelper.userExistByEmail(destinationMail)
    if (!userExistByEmail) {
        return ReE(res, "userNotExist", 400)
    }
    const typeClient = await transactionFunction.getTypeClient(usersId)
    if (typeClient === 4) {
        const checkBalance = await transactionFunction.checkBalance(usersId)
        if (checkBalance < transferAmount) {
            return ReE(res, "insufficientBalance", 400)
        }
    }
    const data = {transferAmount, destinationMail, usersPassword, usersId}
    try {
        const balanceTransfer = await transactionFunction.balanceTransfer(data)
        return ReS(res, balanceTransfer.message, 200)
    } catch (e) {
        return ReE(res, "500", 500, e)
    }
}

/*Transaction History*/
async function transactionHistory(req, res) {
    const page = isNaN(req.query['page']) ? req.query['page'] : 1;
    const usersId = req.user.userId

    try {
        const getHistory = await transactionFunction.getTradingHistory(page, usersId)
        return ReS(res, getHistory, 200)
    } catch (e) {
        return ReE(res, "500", 500, e)
    }
}

module.exports = {
    transfer,
    transactionHistory
}