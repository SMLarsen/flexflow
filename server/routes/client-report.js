/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();
const pg = require('pg');
const config = require('../modules/pg-config');
const pdfDocument = require('pdfkit');
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');
const pool = new pg.Pool({
    database: config.database
});
const NAME_LENGTH = 22;
const AMOUNT_LENGTH = 7;
const MONTHS_ARRAY = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let reportData = {};
let budgetID = 0;
// Route: GET item totals for a budget - include additional "Total" row with sum of amounts for each category
router.post("/", function (req, res, next) {
    budgetID = req.budgetID;
    pool.connect()
        .then(function (client) {
            let queryString = "SELECT category_name, item_name, item_amount, (item_amount * 12) AS annual_amount, item_sort_sequence ";
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
            client.query(queryString, [req.budgetID], function (err, result) {
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
// Route: GET flow item totals for a budget include "Total" row with sums of each month's flow amounts
router.post("/", function (req, res, next) {
    pool.connect()
        .then(function (client) {
            let queryString = "SELECT item_name, item_amount, item_year, item_month, item_sort_sequence ";
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
            client.query(queryString, [req.budgetID], function (err, result) {
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
// Route: GET profile for a budget
router.post("/", function (req, res, next) {
    pool.connect()
        .then(function (client) {
            let queryString = "SELECT * FROM budget ";
            queryString += "WHERE id = $1 ";
            client.query(queryString, [req.budgetID], function (err, result) {
                if (err) {
                    console.log('Error getting profile for reporting', err);
                    client.release();
                    res.sendStatus(500);
                } else {
                    reportData.profile = result.rows[0];
                    reportData.months = formatMonths(reportData.profile.budget_start_month);
                    client.release();
                    next();
                }
            });
        });
});
// Route: GET comments for a budget
router.post("/", function (req, res, next) {
    pool.connect()
        .then(function (client) {
            let queryString = "SELECT * FROM budget_comment ";
            queryString += "WHERE id = $1 ";
            client.query(queryString, [req.budgetID], function (err, result) {
                if (err) {
                    console.log('Error getting comment for reporting', err);
                    client.release();
                    res.sendStatus(500);
                } else {
                    reportData.comment = result.rows;
                    client.release();
                    next();
                }
            });
        });
});
// Route: GET comments for a budget
router.post("/", function (req, res, next) {
    createPDF();
    next();
});
// Function: Order month labels where startMonth is index = 0
function formatMonths(startMonth) {
    let tempMonthArray = MONTHS_ARRAY;
    if (startMonth === 1) {
        return tempMonthArray;
    } else {
        let newMonthArray = tempMonthArray.splice(0, startMonth - 1);
        return tempMonthArray.concat(newMonthArray);
    }
}
//Function: Formats functional, financial, and flex items by category and puts them in reportData object
function formatItems(itemArray) {
    let tempCategoryArray = [];
    let currentCategory = itemArray[0].category_name;
    for (let i = 0; i < itemArray.length; i++) {
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
//Function: Formats fow items and puts them in reportData object
function formatFlowItems(itemArray) {
    let tempCategoryArray = [];
    let tempItem = {};
    for (let i = 0; i < itemArray.length; i += 13) {
        tempItem.category_name = 'Flow';
        tempItem.item_name = itemArray[i].item_name;
        for (let j = 0; j < 12; j++) {
            tempItem['amount_' + (j + 1)] = itemArray[i + j].item_amount;
        }
        tempItem.annual_amount = itemArray[i + 12].item_amount;
        tempCategoryArray.push(tempItem);
        tempItem = {};
    }
    reportData.Flow = tempCategoryArray;
}
// Function: use pdfkit library to create client report pdf -
// note that pdfkit does not support tables at this time, therefore a non-proportional font is used with much manual formatting
function createPDF() {
    let doc = new pdfDocument({
        layout: 'landscape'
    });
    let fileName = 'flexflow.pdf';
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
    let months = padRight('    ', NAME_LENGTH) + padLeft(reportData.months[0], AMOUNT_LENGTH) +
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
    for (let i = 0; i < reportData.Flex.length; i++) {
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
    let takeHome = padLeft(reportData.profile.monthly_take_home_amount, AMOUNT_LENGTH);
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
    console.log('PDF file saved as:', fileName);
}
//Function: format flex, financial, and functional items with correct padding
function formatMonthlyItems(item) {
    return padRight(item.item_name, NAME_LENGTH) + padLeft(item.amount_1, AMOUNT_LENGTH) + padLeft(item.amount_2, AMOUNT_LENGTH) + padLeft(item.amount_3, AMOUNT_LENGTH) +
        padLeft(item.amount_4, AMOUNT_LENGTH) + padLeft(item.amount_5, AMOUNT_LENGTH) + padLeft(item.amount_6, AMOUNT_LENGTH) + padLeft(item.amount_7, AMOUNT_LENGTH) +
        padLeft(item.amount_8, AMOUNT_LENGTH) + padLeft(item.amount_9, AMOUNT_LENGTH) + padLeft(item.amount_10, AMOUNT_LENGTH) + padLeft(item.amount_11, AMOUNT_LENGTH) +
        padLeft(item.amount_12, AMOUNT_LENGTH) + padLeft(item.annual_amount, AMOUNT_LENGTH);
}
//Function: Build totals for summary section
function buildSummaryTotals() {
    reportData.totals = {};
    reportData.totals.expenses = {};
    reportData.totals.net = {};
    let nonFlowTotal = parseInt(reportData.Flex[reportData.Flex.length - 1].item_amount) +
        parseInt(reportData.Functional[reportData.Functional.length - 1].item_amount) +
        parseInt(reportData.Financial[reportData.Financial.length - 1].item_amount);
    let flowTotals = reportData.Flow[reportData.Flow.length - 1];
    reportData.totals.expenses.item_name = 'Expenses';
    reportData.totals.expenses.annual_amount = (nonFlowTotal * 12) + parseInt(flowTotals.annual_amount);
    for (let i = 1; i <= 12; i++) {
        reportData.totals.expenses['amount_' + (i)] = parseInt(flowTotals['amount_' + (i)]) + nonFlowTotal;
    }
    reportData.totals.net.item_name = 'Net Total';
    reportData.totals.net.annual_amount = (parseInt(reportData.profile.monthly_take_home_amount) * 12) - reportData.totals.expenses.annual_amount;
    for (i = 1; i <= 12; i++) {
        reportData.totals.net['amount_' + (i)] = parseInt(reportData.profile.monthly_take_home_amount) - (reportData.totals.expenses['amount_' + (i)]);
    }
}
// Function: format flex, functional, and financial items for report
function formatPDFItem(item) {
    newItem = padRight(item.item_name, NAME_LENGTH);
    for (let i = 1; i <= 12; i++) {
        newItem += padLeft(item.item_amount, AMOUNT_LENGTH);
    }
    newItem += padLeft((item.item_amount * 12), 7);
    return newItem;
}
// Function: right pad items
function padRight(value, length) {
    if (value.length > length) {
        return value.substring(0, length);
    } else {
        for (let i = value.length; i <= length; i++) {
            value += ' ';
        }
        return value;
    }
}
// Function: left pad items
function padLeft(value, length) {
    let paddedValue = ("         " + value.toString()).slice(-length);
    return paddedValue;
}
// Route: Send email with pdf attachment to client
router.post("/", function (req, res) {
    let filePath = path.join(__dirname, './flexflow.pdf');
    let htmlObject = '<h4>Here is your FlexFlow budget summary:</h4>' + '<p>' +
        "Name: " + req.body.displayName + '<br>' +
        "Email: " + req.body.email + '<br>' +
        "Flow Total: $" + req.body.flowTotal + '<br>' +
        "Flex Total: $" + req.body.flexTotal + '<br>' +
        "Functional Total: $" + req.body.functionalTotal + '<br>' +
        "Financial Total: $" + req.body.financialTotal + '<br>' +
        "Monthly Take Home: $" + req.body.takeHomeCash + '<br><br>' +
        "Net Total: $" + req.body.netTotal + '</p>' +
        "<h4> Check out your budget in the attached PDF file</h4>";
    let receivers = req.body.email;
    let maillist = [
        process.env.NODEMAILER_USER,
        receivers,
    ];
    maillist.toString();
    console.log('emaail: ', process.env.NODEMAILER_USER, process.env.NODEMAILER_PASS);
    // create reusable transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });
    let mailOptions = {
        from: 'Flex Flow Planner ✔ <' + process.env.NODEMAILER_USER + '>', // sender address
        to: maillist, // list of receivers
        subject: 'Congratulations ' + req.body.displayName + ' on Completing Your FlexFlow Budget!', // Subject line
        html: htmlObject,
        attachments: [{
            path: filePath, // stream this file
            contentType: "application/pdf"
        }]
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.redirect('/');
            return console.log(error);
        }
        fs.unlink(filePath, function (err) {
            if (err) {
                res.sendStatus(500);
                console.log('Error deleting pdf file', err);
            }
        });
        res.sendStatus(201);
        // console.log('Message sent: ' + info.response);
    });
});
module.exports = router;
