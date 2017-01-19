var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = require('../modules/pg-config');
var fs = require('fs');
var converter = require('json-2-csv');

var nodemailer = require('nodemailer');
var path = require('path');

var pool = new pg.Pool({
    database: config.database
});

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
                    next();
                } else {
                    // console.log('Reporting profile retrieved');
                    csvData.profile = result.rows[0];
                    client.release();
                    next();
                }
            });
        });
});

// Route: GET item totals for a budget
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
                    next();
                } else {
                    // console.log('Reporting items retrieved');
                    formatItems(result.rows);
                    // console.log(result.rows);
                    client.release();
                    next();
                }
            });
        });
});

// Route: GET flow item totals for a budget
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
                    next();
                } else {
                    // console.log('Reporting flow items retrieved');
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
                    next();
                } else {
                    // console.log('Reporting comment retrieved');
                    csvData.comment = result.rows;
                    client.release();
                    res.sendStatus(201);
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
router.post("/", function(req, res, next) {
    var flexCSV = '';
    var csvUser = {
        userName: req.decodedToken.name,
        email: req.decodedToken.email
    };
    converter.json2csv(csvUser, json2csvCallback);
    next();
});

// Route: Create Profile CSV
router.post("/", function(req, res, next) {
    var flexCSV = '';
    converter.json2csv(csvData.profile, json2csvCallback);
    next();
});

// Route: Create Flex CSV
router.post("/", function(req, res, next) {
    var flexCSV = '';
    converter.json2csv(csvData.Flex, json2csvCallback);
    next();
});

// Route: Create Flow CSV
router.post("/", function(req, res, next) {
    var flexCSV = '';
    converter.json2csv(csvData.Flow, json2csvCallback);
    next();
});

// Route: Create Functional CSV
router.post("/", function(req, res, next) {
    var flexCSV = '';
    converter.json2csv(csvData.Functional, json2csvCallback);
    next();
});

// Route: Create FinancialCSV
router.post("/", function(req, res, next) {
    converter.json2csv(csvData.Financial, json2csvCallback);
    next();
});

// Route: Create Comments CSV
router.post("/", function(req, res, next) {
    converter.json2csv(csvData.comment, json2csvLastCallback);
    next();
});

router.post("/", function(req, res) {
    // console.log("im here in send mail");
    // var name =
    //csv.router();
    var filePath = path.join(__dirname, '../csv/flexflow-' + req.budgetID + '.csv');

    var htmlObject = '<p>You have a submission with the folowing details...' + '<br>' +
        "Name: " + req.body.displayName + '<br>' +
        "Email: " + req.body.email + '<br>' +
        "FlowTotal: " + req.body.flowTotal + '<br>' +
        "FlexTotal: " + req.body.flexTotal + '<br>' +
        "FunctionalTotal: " + req.body.functionalTotal + '<br>' +
        "FinancialTotal: " + req.body.financialTotal + '</p>';

    var receivers = req.body.email;

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'lhien11@gmail.com',
            pass: 'at582465'
        }
    });

    var mailOptions = {
        from: 'Hien Le ✔ <lhien11@gmail.com>', // sender address
        to: receivers, // list of receivers
        subject: 'Flex Flow', // Subject line
        // text: 'You have a submission with the folowing details... Name: '+req.body.name + ' Email: '+req.body.email+ ' Message: '+req.body.message, // plaintext body
        // html: '<p>You have a submission with the folowing details... </p> <ul><li>Name: '+req.body.name + ' </li><li>Email: '+req.body.email+ ' </li><li>Message: '+req.body.message+'</li></ul>'// html body
        text: 'You have a submission with the following details from flex flow...',
        html: htmlObject,
        attachments: [
        {
            path: filePath, // stream this file
            contentType: "application/csv"

        }
      ]
    };


    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.redirect('/');
            return console.log(error);
        }

        // console.log('Message sent: ' + info.response);
    });
});


var json2csvCallback = function(err, csv) {
    if (err) throw err;
    csvContent += csv;
};

var json2csvLastCallback = function(err, csv) {
    if (err) throw err;
    csvContent += csv;
    var fileName = 'flexflow-' + budgetID + '.csv';
    fs.writeFile("./server/csv/" + fileName, csvContent, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("CSV file saved as:", fileName);
    });
};

module.exports = router;
