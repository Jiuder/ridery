/*
 * Copyright (c) 2021.
 * Jesus Nuñez <Jesus.nunez2050@gmail.com>
 */

/*Transactions*/
const router = require("./index")
const usersController = require("../controllers/users.controller");
const usersFunctions = require("../controllers/users.controller");
const {passport_authenticate_jwt} = require("../middleware/passport.responses");

/*Get*/

/*Post*/
router.post("/newusers", usersController.newUsers)
router.post("/userslogin", usersFunctions.usersLogin)


/*Put*/
router.put("/updateuser", passport_authenticate_jwt((req, res, next) => {
    return usersController.updateUser(req, res)
}))
router.put("/changepassword", passport_authenticate_jwt((req, res, next) => {
    return usersController.changePassword(req, res)
}))

module.exports = router