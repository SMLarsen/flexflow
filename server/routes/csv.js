var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = require('../modules/pg-config');
var pdfDocument = require('pdfkit');
var blobStream = require('blob-stream');
var iframe = require('iframe');
var fs = require('fs');
var converter = require('json-2-csv');

var pool = new pg.Pool({
    database: config.database
});

var csvData = {};

console.log('CSV route starting -------------------');

// Route: GET item totals for a budget
router.get("/", function(req, res, next) {
    pool.connect()
        .then(function(client) {
            var queryString = "SELECT category_name, item_name, item_amount, item_sort_sequence ";
            queryString += "FROM budget_item, budget_template_category ";
            queryString += "WHERE budget_template_category.id = budget_template_category_id ";
            queryString += "AND budget_id = $1 ";
            queryString += "UNION ";
            queryString += "SELECT budget_template_category.category_name, 'Total', SUM(item_amount) AS monthly_total, 100 AS item_sort_sequence ";
            queryString += "FROM budget_item, budget_template_category ";
            queryString += "WHERE budget_template_category.id = budget_template_category_id ";
            queryString += "AND budget_id = $1 ";
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
            // console.log('queryString:', queryString);
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting flow items for reporting', err);
                    client.release();
                    next();
                } else {
                    console.log('Reporting flow items retrieved');
                    formatFlowItems(result.rows);
                    client.release();
                    next();
                }
            });
        });
});

// Route: GET profile for a budget
router.get("/", function(req, res, next) {
    pool.connect()
        .then(function(client) {
            var queryString = "SELECT * FROM budget ";
            queryString += "WHERE id = $1 ";
            // console.log('queryString:', queryString);
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting profile for reporting', err);
                    client.release();
                    next();
                } else {
                    console.log('Reporting profile retrieved');
                    csvData.profile = result.rows[0];
                    client.release();
                    next();
                }
            });
        });
});

// Route: GET comments for a budget
router.get("/", function(req, res, next) {
    pool.connect()
        .then(function(client) {
            var queryString = "SELECT * FROM budget_comment ";
            queryString += "WHERE id = $1 ";
            // console.log('queryString:', queryString);
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting comment for reporting', err);
                    client.release();
                    res.sendStatus(500);
                    next();
                } else {
                    console.log('Reporting comment retrieved');
                    csvData.comment = result.rows;
                    client.release();
                    res.send(csvData);
                    next();
                }
            });
        });
});

function formatItems(itemArray) {
    var tempCategoryArray = [];
    var currentCategory = itemArray[0].category_name;
    for (var i = 0; i < itemArray.length; i++) {
        delete itemArray[i].item_sort_sequence;
        // console.log(i, itemArray[i].item_name, itemArray[i].category_name, currentCategory, itemArray[i]);
        if (itemArray[i].category_name !== currentCategory || i === itemArray.length - 1) {
            if (i === itemArray.length - 1) {
                tempCategoryArray.push(itemArray[i]);
            }
            csvData[currentCategory] = tempCategoryArray;
            tempCategoryArray = [];
            tempCategoryArray.push(itemArray[i]);
            currentCategory = itemArray[i].category_name;
        } else {
            tempCategoryArray.push(itemArray[i]);
        }
    }
}

function formatFlowItems(itemArray) {
    var tempItemArray = [];
    var tempCategoryArray = [];
    var currentName = itemArray[0].item_name;
    for (var i = 0; i < itemArray.length; i++) {
        if (itemArray[i].item_name === currentName) {
            tempItemArray.push(itemArray[i]);
        } else {
            tempCategoryArray.push(tempItemArray);
            tempItemArray = [];
            tempItemArray.push(itemArray[i]);
            currentName = itemArray[i].item_name;
        }
    }
    tempCategoryArray.push(tempItemArray);
    csvData.Flow = tempCategoryArray;
}

var lastCSV = false;
var csvContent = '';
// Route: Create Flex CSV
router.get("/", function(req, res, next) {
    var flexCSV = '';
    console.log('createCSV Flex');
    converter.json2csv(csvData.Flex, json2csvCallback);
    console.log('csvContent:', csvContent);
    next();
});

// Route: Create Flow CSV
router.get("/", function(req, res, next) {
    var flexCSV = '';
    console.log('createCSV Flow');
    converter.json2csv(csvData.Flow, json2csvCallback);
    console.log('csvContent:', csvContent);
    next();
});

// Route: Create Functional CSV
router.get("/", function(req, res, next) {
    var flexCSV = '';
    console.log('createCSV Functional');
    converter.json2csv(csvData.Functional, json2csvCallback);
    console.log('csvContent:', csvContent);
    next();
});

// Route: Create FinancialCSV
router.get("/", function(req, res, next) {
    console.log('createCSV Financial');
    lastCSV = true;
    converter.json2csv(csvData.Financial, json2csvCallback);
    console.log('csvContent:', csvContent);
    next();
});

var json2csvCallback = function(err, csv) {
    if (err) throw err;
    console.log(123, csv);
    csvContent += csv;
    if (lastCSV) {
        fs.writeFile("./flexflow.csv", csvContent, function(err) {
            if (err) {
                console.log(err);
            }
            console.log("The file was saved!");
        });

    }
};

module.exports = router;
