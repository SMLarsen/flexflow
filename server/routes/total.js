var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

// *********************************** ITEM Totals routes **************************

// Route: GET flow monthly totals for a budget
router.get("/flowitems/totalbymonth", function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var queryString = 'SELECT item_year, item_month, SUM(item_amount) ';
        queryString += 'FROM budget_flow_item ';
        queryString += 'WHERE budget_id = $1 ';
        queryString += 'GROUP BY item_year, item_month';
        console.log('queryString:', queryString);
        client.query(queryString, [req.budgetID], function(err, result) {
            done();
            if (err) {
                console.log('Error getting flow items monthly totals', err);
                res.sendStatus(500);
            } else {
                res.send(result.rows);
                console.log('Flow items monthly totals retrieved');
            }
        });
    });
});

// Route: GET flow yearly total for a budget
router.get("/flowitems/totalbyyear", function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var queryString = 'SELECT SUM(item_amount) ';
        queryString += 'FROM budget_flow_item ';
        queryString += 'WHERE budget_id = $1';
        console.log('queryString:', queryString);
        client.query(queryString, [req.budgetID], function(err, result) {
            done();
            if (err) {
                console.log('Error getting flow items yearly total', err);
                res.sendStatus(500);
            } else {
                res.send(result.rows[0]);
                console.log('Flow items yearly total retrieved');
            }
        });
    });
});

// Route: GET total for a budget category
router.get("/items/:categoryID", function(req, res) {
    var categoryID = req.params.categoryID;
    pg.connect(connectionString, function(err, client, done) {
        var queryString = 'SELECT SUM(item_amount) FROM budget_item ';
        queryString += 'WHERE budget_id = $1 ';
        queryString += 'AND budget_template_category_id = $2';
        console.log('queryString:', queryString);
        client.query(queryString, [req.budgetID, categoryID], function(err, result) {
            done();
            if (err) {
                console.log('Error getting budget items monthly total', err);
                res.sendStatus(500);
            } else {
                res.send(result.rows[0]);
                console.log('Budget items monthly total retrieved');
            }
        });
    });
});

module.exports = router;