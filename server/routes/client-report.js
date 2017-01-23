/*jshint esversion: 6 */

var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = require('../modules/pg-config');
var pdfDocument = require('pdfkit');
var fs = require('fs');

var nodemailer = require('nodemailer');
var path = require('path');

var pool = new pg.Pool({
    database: config.database
});

var NAME_LENGTH = 22;
var AMOUNT_LENGTH = 7;
var MONTHS_ARRAY = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var reportData = {};
var budgetID = 0;

// Route: GET item totals for a budget
router.post("/", function(req, res, next) {
    budgetID = req.budgetID;
    pool.connect()
        .then(function(client) {
            var queryString = "SELECT category_name, item_name, item_amount, (item_amount * 12) AS annual_amount, item_sort_sequence ";
            queryString += "FROM budget_item, budget_template_category ";
            queryString += "WHERE budget_template_category.id = budget_template_category_id ";
            queryString += "AND budget_id = $1 ";
            queryString += "UNION ";
            queryString += "SELECT budget_template_category.category_name, 'Total', SUM(item_amount) AS monthly_total, SUM(item_amount) * 12 AS annual_amount, 100 AS item_sort_sequence ";
            queryString += "FROM budget_item, budget_template_category ";
            queryString += "WHERE budget_template_category.id = budget_template_category_id ";
            queryString += "AND budget_id = $1 ";
            queryString += "GROUP BY budget_template_category.category_name ";
            queryString += "ORDER BY 1, item_sort_sequence";
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting items for reporting', err);
                    client.release();
                    next();
                } else {
                    formattedItems(result.rows);
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
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting flow items for reporting', err);
                    client.release();
                    next();
                } else {
                    formatFlowItems(result.rows);
                    client.release();
                    next();
                }
            });
        });
});

// Route: GET profile for a budget
router.post("/", function(req, res, next) {
    pool.connect()
        .then(function(client) {
            var queryString = "SELECT * FROM budget ";
            queryString += "WHERE id = $1 ";
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting profile for reporting', err);
                    client.release();
                    next();
                } else {
                    reportData.profile = result.rows[0];
                    reportData.months = formatMonths(reportData.profile.budget_start_month);
                    client.release();
                    next();
                }
            });
        });
});

function formatMonths(startMonth) {
    var tempMonthArray = MONTHS_ARRAY;
    if (startMonth === 1) {
        return tempMonthArray;
    } else {
        var newMonthArray = tempMonthArray.splice(0, startMonth - 1);
        return tempMonthArray.concat(newMonthArray);
    }
}

// Route: GET comments for a budget
router.post("/", function(req, res, next) {
    pool.connect()
        .then(function(client) {
            var queryString = "SELECT * FROM budget_comment ";
            queryString += "WHERE id = $1 ";
            client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting comment for reporting', err);
                    client.release();
                    res.sendStatus(500);
                    next();
                } else {
                    reportData.comment = result.rows;
                    client.release();
                    next();
                }
            });
        });
});

function formattedItems(itemArray) {
    var tempCategoryArray = [];
    var currentCategory = itemArray[0].category_name;
    for (var i = 0; i < itemArray.length; i++) {
        if (itemArray[i].category_name !== currentCategory || i === itemArray.length - 1) {
            if (i === itemArray.length - 1) {
                tempCategoryArray.push(itemArray[i]);
            }
            reportData[currentCategory] = tempCategoryArray;
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
    for (var i = 0; i < itemArray.length; i += 13) {
        tempItem.category_name = 'Flow';
        tempItem.item_name = itemArray[i].item_name;
        for (var j = 0; j < 12; j++) {
            tempItem['amount_' + (j + 1)] = itemArray[i + j].item_amount;
        }
        tempItem.annual_amount = itemArray[i + 12].item_amount;
        tempCategoryArray.push(tempItem);
        tempItem = {};
    }
    reportData.Flow = tempCategoryArray;
}

// Route: GET comments for a budget
router.post("/", function(req, res, next) {
    createPDF();
    res.sendStatus(201);
    next();
});

function createPDF() {
    var doc = new pdfDocument({
        layout: 'landscape'
    });
    var fileName = 'flexflow.pdf';
    doc.pipe(fs.createWriteStream("./server/routes/" + fileName));

    // draw some text
    doc.font('Courier', 16)
        .text('Here are your FlexFlow budgeting numbers:', 40, 40);

    doc.fontSize(12)
        .moveDown()
        .text(padRight('Flex Account:', NAME_LENGTH) + '$' + padLeft(reportData.Flex[reportData.Flex.length - 1].item_amount, AMOUNT_LENGTH), {
            width: 1412,
            align: 'justify',
            indent: 40
        });
    doc.moveDown()
        .text(padRight('Flow Account:', NAME_LENGTH) + '$' + padLeft(reportData.Flow[reportData.Flow.length - 1].amount_1, AMOUNT_LENGTH), {
            width: 1412,
            align: 'justify',
            indent: 40
        });
    doc.moveDown()
        .text(padRight('Functional Account:', NAME_LENGTH) + '$' + padLeft(reportData.Functional[reportData.Functional.length - 1].item_amount, AMOUNT_LENGTH), {
            width: 1412,
            align: 'justify',
            indent: 40
        });
    doc.moveDown()
        .text(padRight('Financial Account:', NAME_LENGTH) + '$' + padLeft(reportData.Financial[reportData.Financial.length - 1].item_amount, AMOUNT_LENGTH), {
            width: 1412,
            align: 'justify',
            indent: 40
        });

    // months
    var months = padRight('    ', NAME_LENGTH) + padLeft(reportData.months[0], AMOUNT_LENGTH) +
        padLeft(reportData.months[1], AMOUNT_LENGTH) + padLeft(reportData.months[2], AMOUNT_LENGTH) +
        padLeft(reportData.months[3], AMOUNT_LENGTH) + padLeft(reportData.months[4], AMOUNT_LENGTH) +
        padLeft(reportData.months[5], AMOUNT_LENGTH) + padLeft(reportData.months[6], AMOUNT_LENGTH) +
        padLeft(reportData.months[7], AMOUNT_LENGTH) + padLeft(reportData.months[8], AMOUNT_LENGTH) +
        padLeft(reportData.months[9], AMOUNT_LENGTH) + padLeft(reportData.months[10], AMOUNT_LENGTH) +
        padLeft(reportData.months[11], AMOUNT_LENGTH) + padLeft('Annual', AMOUNT_LENGTH);
    doc.fontSize(10)
        .moveDown()
        .moveDown()
        .text(months, {
            width: 1412,
            align: 'justify',
            indent: 10
        });

    // flex items
    doc.font('Courier', 12)
        .moveDown()
        .text('Flex Accounts:');
    for (var i = 0; i < reportData.Flex.length; i++) {
        item = reportData.Flex[i];
        formattedItem = formatPDFItem(item);
        doc.font('Courier', 10)
            .moveDown()
            .text(formattedItem, {
                width: 1412,
                align: 'justify',
                indent: 10
            });
    }

    // // flow items
    doc.fontSize(12)
        .moveDown()
        .text('Flow Accounts:');
    for (i = 0; i < reportData.Flow.length; i++) {
        formattedItem = formatMonthlyItems(reportData.Flow[i]);
        doc.font('Courier', 10)
            .moveDown()
            .text(formattedItem, {
                width: 1412,
                align: 'justify',
                indent: 10,
                ellipsis: true
            });
    }

    // functional items
    doc.fontSize(12)
        .moveDown()
        .text('Functional Accounts:');
    for (i = 0; i < reportData.Functional.length; i++) {
        item = reportData.Functional[i];
        formattedItem = formatPDFItem(item);
        doc.font('Courier', 10)
            .moveDown()
            .text(formattedItem, {
                width: 1412,
                align: 'justify',
                indent: 10,
                ellipsis: true
            });
    }

    // Financial items
    doc.fontSize(12)
        .moveDown()
        .text('Financial Accounts:');
    for (i = 0; i < reportData.Financial.length; i++) {
        item = reportData.Financial[i];
        formattedItem = formatPDFItem(item);
        doc.font('Courier', 10)
            .moveDown()
            .text(formattedItem, {
                width: 1412,
                align: 'justify',
                indent: 10,
                ellipsis: true
            });
    }

    // Summary
    buildSummaryTotals();
    doc.font('Courier', 12)
        .moveDown()
        .text('Summary:');
    var takeHome = padLeft(reportData.profile.monthly_take_home_amount, AMOUNT_LENGTH);
    item = padRight('Monthly Takehome', NAME_LENGTH) + takeHome + takeHome + takeHome + takeHome + takeHome + takeHome + takeHome + takeHome + takeHome + takeHome + takeHome + takeHome + padLeft((reportData.profile.monthly_take_home_amount * 12), AMOUNT_LENGTH);
    doc.font('Courier', 10)
        .moveDown()
        .text(item, {
            width: 1412,
            align: 'justify',
            indent: 10
        });
    formattedItem = formatMonthlyItems(reportData.totals.expenses);
    doc.font('Courier', 10)
        .moveDown()
        .text(formattedItem, {
            width: 1412,
            align: 'justify',
            indent: 10,
            ellipsis: true
        });
    formattedItem = formatMonthlyItems(reportData.totals.net);
    doc.font('Courier', 10)
        .moveDown()
        .text(formattedItem, {
            width: 1412,
            align: 'justify',
            indent: 10,
            ellipsis: true
        });

    // end and display the document in the iframe to the right
    doc.end();
    console.log('PDF created:', fileName);
}

function formatMonthlyItems(item) {
    return padRight(item.item_name, NAME_LENGTH) + padLeft(item.amount_1, AMOUNT_LENGTH) + padLeft(item.amount_2, AMOUNT_LENGTH) + padLeft(item.amount_3, AMOUNT_LENGTH) +
        padLeft(item.amount_4, AMOUNT_LENGTH) + padLeft(item.amount_5, AMOUNT_LENGTH) + padLeft(item.amount_6, AMOUNT_LENGTH) + padLeft(item.amount_7, AMOUNT_LENGTH) +
        padLeft(item.amount_8, AMOUNT_LENGTH) + padLeft(item.amount_9, AMOUNT_LENGTH) + padLeft(item.amount_10, AMOUNT_LENGTH) + padLeft(item.amount_11, AMOUNT_LENGTH) +
        padLeft(item.amount_12, AMOUNT_LENGTH) + padLeft(item.annual_amount, AMOUNT_LENGTH);
}

function buildSummaryTotals() {
    reportData.totals = {};
    reportData.totals.expenses = {};
    reportData.totals.net = {};

    var nonFlowTotal = parseInt(reportData.Flex[reportData.Flex.length - 1].item_amount) +
        parseInt(reportData.Functional[reportData.Functional.length - 1].item_amount) +
        parseInt(reportData.Financial[reportData.Financial.length - 1].item_amount);
    var flowTotals = reportData.Flow[reportData.Flow.length - 1];

    reportData.totals.expenses.item_name = 'Expenses';
    reportData.totals.expenses.annual_amount = (nonFlowTotal * 12) + parseInt(flowTotals.annual_amount);
    for (var i = 1; i <= 12; i++) {
        reportData.totals.expenses['amount_' + (i)] = parseInt(flowTotals['amount_' + (i)]) + nonFlowTotal;
    }

    reportData.totals.net.item_name = 'Net Total';
    reportData.totals.net.annual_amount = (parseInt(reportData.profile.monthly_take_home_amount) * 12) - reportData.totals.expenses.annual_amount;
    for (i = 1; i <= 12; i++) {
        reportData.totals.net['amount_' + (i)] = parseInt(reportData.profile.monthly_take_home_amount) - (reportData.totals.expenses['amount_' + (i)]);
    }
}

function padRight(value, length) {
    if (value.length > length) {
        return value.substring(0, length);
    } else {
        for (var i = value.length; i <= length; i++) {
            value += ' ';
        }
        return value;
    }
}

function formatPDFItem(item) {
    newItem = padRight(item.item_name, NAME_LENGTH);
    for (var i = 1; i <= 12; i++) {
        newItem += padLeft(item.item_amount, AMOUNT_LENGTH);
    }
    newItem += padLeft((item.item_amount * 12), 7);
    return newItem;
}

function padLeft(value, length) {
    var paddedValue = ("         " + value.toString()).slice(-length);
    return paddedValue;

}

router.post("/", function(req, res) {
    // console.log("im here in send mail");
    // var name =
    //csv.router();
    var filePath = path.join(__dirname, './flexflow.pdf');

    var htmlObject = '<p>You have a submission with the following details...' + '<br>' +
        "Name: " + req.body.displayName + '<br>' +
        "Email: " + req.body.email + '<br>' +
        "Flow Total: $" + req.body.flowTotal + '<br>' +
        "Flex Total: $" + req.body.flexTotal + '<br>' +
        "Functional Total: $" + req.body.functionalTotal + '<br>' +
        "Financial Total: $" + req.body.financialTotal + '<br>' +
        "Monthly Take Home: $" + req.body.takeHomeCash + '<br>' +
        "Net Total: $" + req.body.netTotal + '</p>';

    var receivers = req.body.email;
    var maillist = [
      'flexflowplanner@gmail.com',
      receivers,
    ];
    maillist.toString();

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
        to: maillist,  // list of receivers
        subject: 'Flex Flow', // Subject line
        // text: 'You have a submission with the folowing details... Name: '+req.body.name + ' Email: '+req.body.email+ ' Message: '+req.body.message, // plaintext body
        // html: '<p>You have a submission with the folowing details... </p> <ul><li>Name: '+req.body.name + ' </li><li>Email: '+req.body.email+ ' </li><li>Message: '+req.body.message+'</li></ul>'// html body
        text: 'You have a submission with the following details from flex flow...',
        html: htmlObject,
        attachments: [
        {
            path: filePath, // stream this file
            contentType: "application/pdf"
        }
      ]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            res.redirect('/');
            return console.log(error);
        }
        fs.unlink(filePath);

        // console.log('Message sent: ' + info.response);
    });
});

module.exports = router;
