const db = require('../services/database').config;

let getUsers = () => new Promise((resolve, reject) => {
    db.query("SELECT * FROM inkforge_users", function (err, users, fields) {
        if (err) {
            reject(err);
        } else {
            console.log(users);
            resolve(users);
        }
    })
})

module.exports = {
    getUsers
}