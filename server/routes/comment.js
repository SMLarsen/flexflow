/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();

var pg = require('pg');
var config = require('../modules/pg-config');

var pool = new pg.Pool({
    database: config.database
});

router.get('/', function(req, res) {
    console.log("here in comment ", pool);
    pool.connect()
        .then(function(client) {
          var queryString = 'SELECT budget_comment, id, created_at FROM budget_comment WHERE budget_id = $1';
            client.query(queryString, [req.budgetID])
                .then(function(result) {
                    client.release();
                    res.send(result.rows);
                }).catch(function(err) {
                    // error
                    client.release();
                    console.log('Error on get comment', err);
                    res.sendStatus(500);
                }); // end inner then
        }); // end first then
}); // end pool.connect

router.post('/', function(req, res){
  console.log("here in post comment");
  pool.connect()
    .then(function(client){
      // make query
      client.query('INSERT INTO budget_comment (budget_id, budget_comment) VALUES($1, $2)',
      [req.budgetID, req.body.budget_comment])
        .then(function(result){
          client.release();
          res.sendStatus(201);
        }).catch(function(err){
          // error
          client.release();
          console.log('Error on POST comment', err);
          res.sendStatus(500);
        });
    }); // end first then
});



module.exports = router;
