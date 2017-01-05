var router = require('express').Router();
var pg = require('pg');
var config = require('../modules/database-config.js');

var pool = new pg.Pool({
  database: config.database
});

// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// get user
router.get('/', function(req, res) {
  console.log('getting user', pool);
  pool.connect()
    .then(function(client) {
      // make query
      client.query(
        'SELECT * FROM users')
        .then(function(result) {
          client.release();
          res.send(result.rows);
        })
        .catch(function(err) {
          // error
          client.release();
          console.log('error on SELECT', err);
          res.sendStatus(500);
        });
    });
});

module.exports = router;
