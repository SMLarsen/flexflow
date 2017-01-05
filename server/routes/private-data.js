var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

router.get("/", function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var userEmail = req.decodedToken.email;
        console.log(userEmail);
        /* getting user by email */
        client.query('SELECT * FROM users WHERE email=$1', [userEmail], function(err, result) {
            done();
            if (err) {
                console.log('Error COMPLETING clearance_level query task', err);
                res.sendStatus(500);
            } else {
                pg.connect(connectionString, function(err, client, done) {
                    /* if user does not exist, add to user table */
                    if (result.rowCount === 0) {
                        client.query(
                            'INSERT INTO users (email) VALUES ($1)', [userEmail],
                            function(err, result) {
                                done();
                                if (err) {
                                    console.log('error on user Insert', err);
                                    res.sendStatus(500);
                                } else {
                                    /* Retrieve new user to get id */
                                    client.query('SELECT * FROM users WHERE email=$1', [userEmail], function(err, result) {
                                        done();
                                        if (err) {
                                            console.log('Error Selecting new user', err);
                                            res.sendStatus(500);
                                        } else {
                                            var currentUser = result.rows[0];
                                            console.log('new User:', currentUser);
                                            res.send(currentUser);
                                        }
                                    });
                                }
                            });
                    } else {
                        var currentUser = result.rows[0];
                        console.log('currentUser:', currentUser);
                        res.send(currentUser);
                    }
                    done();
                });
            }
        });
    });
});

module.exports = router;
