var express = require('express');
var router = express.Router();
var pg = require('pg');
// var connectionString = require('../modules/database-config');
var config = require('../modules/pg-config');

var pool = new pg.Pool({
    database: config.database
});

var reportData = {};


// Route: GET item totals for a budget
router.get("/", function(req, res, next) {
    pool.connect()
        .then(function(client) {
            var queryString = "SELECT category_name, item_name, item_amount, (item_amount * 12) AS annual_amount, item_sort_sequence ";
            queryString += "FROM budget_item, budget_template_category ";
            queryString += "WHERE budget_template_category.id = budget_template_category_id ";
            queryString += "AND budget_id = $1 ";
            // queryString += "AND budget_template_category.id = $2 ";
            queryString += "UNION ";
            queryString += "SELECT budget_template_category.category_name, 'Total', SUM(item_amount) AS monthly_total, SUM(item_amount) * 12 AS annual_amount, 100 AS item_sort_sequence ";
            queryString += "FROM budget_item, budget_template_category ";
            queryString += "WHERE budget_template_category.id = budget_template_category_id ";
            queryString += "AND budget_id = $1 ";
            // queryString += "AND budget_template_category.id = $2 ";
            queryString += "GROUP BY budget_template_category.category_name ";
            queryString += "ORDER BY 1, item_sort_sequence";
            // console.log('queryString:', queryString);
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting items for reporting', err);
                    client.release();
                    next();
                } else {
                    console.log('Reporting items retrieved');
                    formatItems(result.rows);
                    // console.log(result.rows);
                    client.release();
                    next();
                }
            });
        });
});

// Route: GET flow item totals for a budget
router.get("/", function(req, res, next) {
    pool.connect()
        .then(function(client) {
            var queryString = "SELECT item_name, item_amount, item_year, item_month, item_sort_sequence ";
            queryString += "FROM budget_flow_item ";
            queryString += "WHERE budget_id = $1 ";
            queryString += "UNION ";
            queryString += "SELECT item_name, SUM(item_amount) AS annual_amount, MAX(item_year) + 1 AS item_year, 1 AS item_month, item_sort_sequence ";
            queryString += "FROM budget_flow_item ";
            queryString += "WHERE budget_id = $1 ";
            queryString += "GROUP BY item_name, item_sort_sequence ";
            queryString += "UNION ";
            queryString += "SELECT 'Total', SUM(item_amount), item_year, item_month, 99 AS item_sort_sequence ";
            queryString += "FROM budget_flow_item ";
            queryString += "WHERE budget_id = $1 ";
            queryString += "GROUP BY item_year, item_month ";
            queryString += "UNION ";
            queryString += "SELECT 'Total', SUM(item_amount) AS annual_amount, MAX(item_year) + 1 AS item_year, 1 AS item_month, 99 AS item_sort_sequence ";
            queryString += "FROM budget_flow_item ";
            queryString += "WHERE budget_id = $1 ";
            queryString += "ORDER BY item_sort_sequence, item_year, item_month";
            console.log('queryString:', queryString);
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting flow items for reporting', err);
                    client.release();
                    next();
                } else {
                    console.log('Reporting flow items retrieved');
                    reportData.Flow = result.rows;
                    console.log(result.rows);
                    console.log(reportData);
                    client.release();
                    next();
                }
            });
        });
});

function formatItems(itemArray) {
    var tempItemArray = [];
    var tempCategoryArray = [];
    // console.log('itemArray[0]', itemArray[0]);
    var currentName = itemArray[0].item_name;
    var currentCategory = itemArray[0].category_name;
    for (var i = 0; i < itemArray.length; i++) {
      console.log(i, itemArray[i].item_name, currentName, currentCategory, itemArray[i]);
        if (itemArray[i].item_name === currentName) {
            tempItemArray.push(itemArray[i]);
            console.log('push1:', i);
            // console.log('tempItemArray', tempItemArray);
        } else {
            tempCategoryArray.push(tempItemArray);
            tempItemArray = [];
            tempItemArray.push(itemArray[i]);
            console.log('push2:', i);
            currentName = itemArray[i].item_name;
            if (itemArray[i].category_name !== currentCategory || i === itemArray.length - 1) {
                reportData[currentCategory] = tempCategoryArray;
                tempCategoryArray = [];
                currentCategory = itemArray[i].category_name;
                console.log("reportData:", reportData);
            }
        }
    }
}

module.exports = router;
