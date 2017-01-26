var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = require('../modules/pg-config');

var pool = new pg.Pool(config.pg);

router.get("/", function(req, res) {
    pool.connect()
    .then(function(client) {
        client.query('SELECT * FROM administration', function(err, result) {
            if (err) {
                client.release();
                console.log('Error getting admin data', err);
                res.sendStatus(500);
            } else {
                client.release();
                res.send(result.rows);
            }
        });
    });
});

module.exports = router;
