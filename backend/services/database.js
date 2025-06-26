require('dotenv').config();
const mysql = require("mysql2");

const config = mysql.createPool({
    host: "atp.fhstp.ac.at",
    port: 8007,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "cc241002",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// config.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected to database...");
// });

module.exports = {config}