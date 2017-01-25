/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();

var pg = require('pg');
var config = require('../modules/pg-config');

var pool = new pg.Pool(config.config);

// var pool = new pg.Pool({
//     database: config.database
// });

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

router.post('/', function(req, res) {
    console.log("here in post comment");
    pool.connect()
        .then(function(client) {
            // make query
            client.query('INSERT INTO budget_comment (budget_id, budget_comment) VALUES($1, $2)',
            [req.budgetID, req.body.budget_comment])
                .then(function(result) {
                    client.release();
                    res.sendStatus(201);
                }).catch(function(err) {
                    // error
                    client.release();
                    console.log('Error on POST comment', err);
                    res.sendStatus(500);
                });
        }); // end first then
});

router.put('/:id', function(req, res) {
    // console.log("here in edit comment");
    // Grab data from the URL parameters
    var commentID = req.params.id;

    // the data to send to edit
    var data = {
        budget_comment: req.body.budget_comment,
    };

    pool.connect()
        .then(function(client) {
          // make query
          client.query('UPDATE budget_comment SET budget_comment=($1) WHERE id=($2)',
          [data.budget_comment, commentID])
            .then(function(result){
              client.release();
              res.sendStatus(201);
            }).catch(function(err){
              // error
              client.release();
              console.log('Error on EDIT comment', err);
              res.sendStatus(500);
            });
        });


});



module.exports = router;
