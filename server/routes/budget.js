var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

router.get("/profile/:email", function(req, res) {
    var userEmail = req.params.email;
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT id FROM users WHERE email = $1', [userEmail], function(err, result) {
            done();
            if (err) {
                console.log('Error getting userID:', err);
                res.sendStatus(500);
            } else {
                var userID = result.rows[0].id;
                client.query('SELECT id, budget_start_month, budget_start_year, monthly_take_home_amount, annual_salary, meeting_scheduled FROM budget WHERE user_id = $1', [userID], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error COMPLETING profile select profile', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows[0]);
                        console.log('retrieved profile', result.rows[0]);
                    }
                });
            }
        });
    });
});

module.exports = router;
