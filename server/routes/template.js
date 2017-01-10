var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

router.get("/category", function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT * FROM budget_category', function(err, result) {
            done();
            if (err) {
                console.log('Error COMPLETING category select task', err);
                res.sendStatus(500);
            } else {
              res.send(result.rows);
              console.log('retrieved categories');
            }
        });
    });
});

router.get("/item", function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT * FROM budget_item', function(err, result) {
            done();
            if (err) {
                console.log('Error COMPLETING item select task', err);
                res.sendStatus(500);
            } else {
              res.send(result.rows);
              console.log('retrieved items');
            }
        });
    });
});

module.exports = router;
