const userModel = require("../models/userModel");

function getUsers(req, res, next) {
    return userModel.getUsers()
        .then(users => res.render('users', {users}))
        //.catch(err => next(err));

}

module.exports = {
    getUsers,
}
