var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

// *********************************** BUDGET PROFILE routes **************************
router.get("/", function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT id, budget_start_month, budget_start_year, monthly_take_home_amount, annual_salary, meeting_scheduled FROM budget WHERE user_id = $1', [req.userID], function(err, result) {
            done();
            if (err) {
                console.log('Error getting profile', err);
                res.sendStatus(500);
            } else {
                res.send(result.rows[0]);
                console.log('retrieved profile');
            }
        });
    });
});

// Route: Post budget profile for a user
router.post("/", function(req, res) {
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function(err, client, done) {
        var queryString = 'INSERT INTO budget ';
        queryString += '(user_id, budget_start_month, budget_start_year, monthly_take_home_amount, annual_salary,';
        queryString += ' meeting_scheduled) ';
        queryString += 'VALUES ($1, $2, $3, $4, $5, $6)';
        client.query(queryString, [req.userID, req.body.budget_start_month, req.body.budget_start_year, req.body.monthly_take_home_amount, req.body.annual_salary, req.body.meeting_scheduled],
            function(err, result) {
                done();
                if (err) {
                    console.log('Error Inserting profile', err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                    console.log('Profile inserted');
                }
            }
        );
    });
});

// Route: Update budget profile for a user
router.put("/", function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var queryString = 'UPDATE budget SET ';
        queryString += 'budget_start_month = $1, budget_start_year = $2, monthly_take_home_amount = $3,';
        queryString += ' annual_salary = $4, meeting_scheduled = $5 ';
        queryString += 'WHERE user_id = $6';
        client.query(queryString, [req.body.budget_start_month, req.body.budget_start_year, req.body.monthly_take_home_amount, req.body.annual_salary, req.body.meeting_scheduled, req.userID],
            function(err, result) {
                done();
                if (err) {
                    console.log('Error Updating profile', err);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                    console.log('Profile updated');
                }
            }
        );
    });
});

module.exports = router;