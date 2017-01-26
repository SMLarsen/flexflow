var express = require('express');
var router = express.Router();
var pg = require('pg');

var config = require('../modules/pg-config');

var pool = new pg.Pool(config.pg);

// *********************************** BUDGET PROFILE routes **************************
router.get("/", function(req, res) {
    pool.connect()
    .then( function(client) {
        client.query('SELECT id, budget_start_month, budget_start_year, monthly_take_home_amount, annual_salary, meeting_scheduled, budget_status FROM budget WHERE user_id = $1', [req.userID], function(err, result) {
            if (err) {
                console.log('Error getting profile', err);
                res.sendStatus(500);
                client.release();
            } else {
                res.send(result.rows[0]);
                console.log('retrieved profile');
                client.release();
            }
        });
    });
});

// Route: Post budget profile for a user
router.post("/", function(req, res) {
    var userEmail = req.decodedToken.email;
    pool.connect()
    .then( function(client) {
        var queryString = 'INSERT INTO budget ';
        queryString += '(user_id, budget_start_month, budget_start_year, monthly_take_home_amount, annual_salary,';
        queryString += ' meeting_scheduled, budget_status) ';
        queryString += 'VALUES ($1, $2, $3, $4, $5, $6, $7)';
        client.query(queryString, [req.userID, req.body.budget_start_month, req.body.budget_start_year, req.body.monthly_take_home_amount, req.body.annual_salary, req.body.meeting_scheduled, req.body.budget_status],
            function(err, result) {
                if (err) {
                    console.log('Error Inserting profile', err);
                    res.sendStatus(500);
                    client.release();
                } else {
                    res.sendStatus(201);
                    console.log('Profile inserted');
                    client.release();
                }
            }
        );
    });
});

// Route: Update budget profile for a user
router.put("/", function(req, res) {
    pool.connect()
    .then( function(client) {
      console.log(req.budgetID);
        var queryString = 'UPDATE budget SET ';
        queryString += 'budget_start_month = $1, budget_start_year = $2, monthly_take_home_amount = $3,';
        queryString += ' annual_salary = $4, meeting_scheduled = $5, budget_status = $6 ';
        queryString += 'WHERE id = $7';
        client.query(queryString, [req.body.budget_start_month, req.body.budget_start_year, req.body.monthly_take_home_amount, req.body.annual_salary, req.body.meeting_scheduled, req.body.budget_status, req.budgetID],
            function(err, result) {
                if (err) {
                    console.log('Error Updating profile', err);
                    res.sendStatus(500);
                    client.release();
                } else {
                    res.sendStatus(201);
                    console.log('Profile updated');
                    client.release();
                }
            }
        );
    });
});

module.exports = router;
