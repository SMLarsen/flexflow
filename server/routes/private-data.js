var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

router.get("/", function(req, res) {
    console.log('get route');
    pg.connect(connectionString, function(err, client, done) {
        var userEmail = req.decodedToken.email;
        console.log(userEmail);
        // Check the user's level of permision based on their email
        client.query('SELECT clearance_level FROM users WHERE email=$1', [userEmail], function(err, clearanceLevelQueryResult) {
            done();
            if (err) {
                console.log('Error COMPLETING clearance_level query task', err);
                res.sendStatus(500);
            } else {
                pg.connect(connectionString, function(err, client, done) {
                    if (clearanceLevelQueryResult.rowCount === 0) {
                        client.query(
                            'INSERT INTO users (email) VALUES ($1)', [userEmail],
                            function(err, result) {
                                done();
                                if (err) {
                                    console.log('error on user Insert', err);
                                    res.sendStatus(500);
                                } else {
                                    console.log('user insert successful for:', userEmail);
                                    res.sendStatus(200);
                                }
                            });
                    } else {
                        var clearanceLevel = clearanceLevelQueryResult.rows[0].clearance_level;
                        console.log('clearanceLevel:', clearanceLevel);
                    }
                    done();
                });
            }
        });
    });
});

module.exports = router;
