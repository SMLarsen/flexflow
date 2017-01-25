/*jshint esversion: 6 */

var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = require('../modules/pg-config');
var fs = require('fs');
var converter = require('json-2-csv');

var nodemailer = require('nodemailer');
var path = require('path');

var pool = new pg.Pool(config.pg);

// var pool = new pg.Pool({
//     database: config.database
// });

var csvData = {};
var budgetID = '';

// Route: GET profile for a budget
router.post("/", function(req, res, next) {
    budgetID = req.budgetID;
    pool.connect()
        .then(function(client) {
            var queryString = "SELECT budget_start_year, budget_start_month, annual_salary, monthly_take_home_amount, meeting_scheduled, budget_status FROM budget ";
            queryString += "WHERE id = $1 ";
            // console.log('queryString:', queryString);
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting profile for reporting', err);
                    client.release();
                    res.sendStatus(500);
                } else {
                    // console.log('Reporting profile retrieved');
                    csvData.profile = result.rows[0];
                    client.release();
                    next();
                }
            });
        });
});

// Route: GET items (flex, functional, financial) for a budget with "total" row for each category
router.post("/", function(req, res, next) {
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
                    res.sendStatus(500);
                } else {
                    formatItems(result.rows);
                    client.release();
                    next();
                }
            });
        });
});

// Route: GET flow items tfor a budget with total rows for each month
router.post("/", function(req, res, next) {
    pool.connect()
        .then(function(client) {
            var queryString = "SELECT item_year, item_month, item_name, item_amount, item_sort_sequence ";
            queryString += "FROM budget_flow_item ";
            queryString += "WHERE budget_id = $1 ";
            queryString += "UNION ";
            queryString += "SELECT item_year, item_month, 'Total' AS item_name, SUM(item_amount) AS item_amount, 99 AS item_sort_sequence ";
            queryString += "FROM budget_flow_item ";
            queryString += "WHERE budget_id = $1 ";
            queryString += "GROUP BY item_year, item_month ";
            queryString += "ORDER BY item_sort_sequence, item_year, item_month";
            // console.log('queryString:', queryString);
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting flow items for reporting', err);
                    client.release();
                    res.sendStatus(500);
                } else {
                    formatFlowItems(result.rows);
                    client.release();
                    next();
                }
            });
        });
});

// Route: GET comments for a budget
router.post("/", function(req, res, next) {
    pool.connect()
        .then(function(client) {
            var queryString = "SELECT budget_comment FROM budget_comment ";
            queryString += "WHERE id = $1 ";
            // console.log('queryString:', queryString);
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting comment for reporting', err);
                    client.release();
                    res.sendStatus(500);
                } else {
                    // console.log('Reporting comment retrieved');
                    csvData.comment = result.rows;
                    client.release();
                    next();
                }
            });
        });
});

// Function: format flex, functional, and financial items and add array for each category to csvData object
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

// Function: format flow items and add array to csvData object
function formatFlowItems(itemArray) {
    var tempCategoryArray = [];
    var tempItem = {};
    for (var i = 0; i < itemArray.length; i += 12) {
        tempItem.category_name = 'Flow';
        tempItem.item_name = itemArray[i].item_name;
        for (var j = 0; j < 12; j++) {
            tempItem['amount_' + (j + 1)] = itemArray[i + j].item_amount;
        }
        tempCategoryArray.push(tempItem);
        tempItem = {};
    }
    csvData.Flow = tempCategoryArray;
}
var csvContent = '';

// Route: Create Customer CSV
router.post("/", function(req, res) {
    var csvUser = {
        userName: req.decodedToken.name,
        email: req.decodedToken.email
    };
    converter.json2csv(csvUser, json2csvCallback);
    converter.json2csv(csvData.profile, json2csvCallback);
    converter.json2csv(csvData.Flex, json2csvCallback);
    converter.json2csv(csvData.Flow, json2csvCallback);
    converter.json2csv(csvData.Functional, json2csvCallback);
    converter.json2csv(csvData.Financial, json2csvCallback);
    converter.json2csv(csvData.comment, json2csvLastCallback);
    var filePath = path.join(__dirname, './flexflow-' + req.budgetID + '.csv');

    var htmlObject = '<p>You have a new csv file for ' + req.body.displayName + '<br>' +
        "Email: " + req.body.email;

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'flexflowplanner@gmail.com',
            pass: 'flexflow!'
        }
    });

    var mailOptions = {
        from: 'Flex Flow Planner ✔ <flexflowplanner@gmail.com>', // sender address
        to: "flexflowplanner@gmail.com", // list of receivers
        subject: 'You have a new FlexFlow csv file for ' + req.body.displayName,
        html: htmlObject,
        attachments: [{
            path: filePath, // stream this file
            contentType: "application/csv"
        }]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.redirect('/');
            return console.log(error);
        }
        fs.unlink(filePath, function(err) {
          if (err) {
            res.sendStatus(500);
            console.log('Error deleting csv file', err);
          }
        });
        res.sendStatus(201);

        // console.log('Message sent: ' + info.response);
    });
});

// Function: use json2csv library to add category to csvContent
var json2csvCallback = function(err, csv) {
    if (err) throw err;
    csvContent += csv;
};

// Function: use json2csv library to add category to csvContent then write file
var json2csvLastCallback = function(err, csv) {
    if (err) throw err;
    csvContent += csv;
    var fileName = 'flexflow-' + budgetID + '.csv';
    fs.writeFile("./server/routes/" + fileName, csvContent, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("CSV file saved as:", fileName);
    });
};

module.exports = router;
