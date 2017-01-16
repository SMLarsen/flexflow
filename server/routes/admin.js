var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');


router.get("/", function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT * FROM administration', function(err, result) {
            done();
            if (err) {
                console.log('Error getting admin data', err);
                res.sendStatus(500);
            } else {
                res.send(result.rows);
                done();
            }
        });
    });
});

module.exports = router;
