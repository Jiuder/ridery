/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

/*Transactions*/
const router = require("./index");
const transactionsController = require("../controllers/transactions.controller");
const {passport_authenticate_jwt} = require("../middleware/passport.responses");

/*Get*/
router.get("/transactionhistory", passport_authenticate_jwt((req, res, next) => {
    return transactionsController.transactionHistory(req, res)
}))

/*Post*/
router.post("/transfer", passport_authenticate_jwt((req, res, next) => {
    return transactionsController.transfer(req, res)
}))


module.exports = router;

