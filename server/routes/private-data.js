var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = require('../modules/pg-config');

var pool = new pg.Pool(config.pg);

router.get("/privateData", function(req, res) {
    pool.connect()
        .then(function(client) {
            var userEmail = req.decodedToken.email;
            /* getting user by email */
            client.query('SELECT * FROM users WHERE email=$1', [userEmail], function(err, result) {
                if (err) {
                    console.log('Error COMPLETING clearance_level query task', err);
                    res.sendStatus(500);
                    client.release();

                } else {
                    pool.connect()
                        .then(function(client) {
                            /* if user does not exist, add to user table */
                            if (result.rowCount === 0) {
                                client.query(
                                    'INSERT INTO users (email) VALUES ($1) RETURNING *', [userEmail],
                                    function(err, result) {
                                        if (err) {
                                            console.log('error on user Insert', err);
                                            res.sendStatus(500);
                                            client.release();

                                        } else {
                                            var currentUser = result.rows[0];
                                            currentUser.newUser = true;
                                            res.send(currentUser);
                                            client.release();
                                        }
                                    });
                            } else {
                                var currentUser = result.rows[0];
                                currentUser.newUser = false;
                                res.send(currentUser);
                                client.release();

                            }
                        });
                }
            });
        });
});

module.exports = router;
