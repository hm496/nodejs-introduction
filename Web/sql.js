// get the client
const mysql = require('mysql2');

var pool  = mysql.createPool({
  connectionLimit: 20,
  host: '192.168.1.191',
  port: '3308',
  user: 'dida',
  password: 'pinche',
  database: 'didapinche'
});

module.exports = pool;

// // with placeholder
// connection.query(
//   `SELECT
// e.id,e.account_id,e.cid
// FROM taxi_driver d
//
// INNER JOIN user_user e
// ON e.id = d.user_id
//
// WHERE d.certification_state = 3;`,
//   function (err, results) {
//     console.log(results);
//   }
// );


// exports = {
//   name: "Bob"
// };
