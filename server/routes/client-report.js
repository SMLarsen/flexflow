var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = require('../modules/pg-config');
var pdfDocument = require('pdfkit');
var fs = require('fs');

var pool = new pg.Pool({
    database: config.database
});

var NAME_LENGTH = 22;
var AMOUNT_LENGTH = 7;
var MONTHS_ARRAY = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var reportData = {};
var budgetID = 0;

// Route: GET item totals for a budget
router.get("/", function(req, res, next) {
    budgetID = req.budgetID;
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
                    // console.log('Reporting items retrieved');
                    formattedItems(result.rows);
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
                    // console.log('Reporting flow items retrieved');
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
                    // console.log('Reporting profile retrieved');
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
                    // console.log('Reporting comment retrieved');
                    reportData.comment = result.rows;
                    client.release();
                    // res.sendStatus(201);
                    next();
                }
            });
        });
});

function formattedItems(itemArray) {
    var tempCategoryArray = [];
    var currentCategory = itemArray[0].category_name;
    for (var i = 0; i < itemArray.length; i++) {
        // console.log(i, itemArray[i].item_name, itemArray[i].category_name, currentCategory, itemArray[i]);
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
router.get("/", function(req, res, next) {
    createPDF();
    res.sendStatus(201);
    next();
});

function createPDF() {
    var doc = new pdfDocument({
        layout: 'landscape'
    });
    var fileName = 'flexflow-' + budgetID + '.pdf';
    doc.pipe(fs.createWriteStream("./server/pdf/" + fileName));

    // draw some text
    doc.fontSize(16)
        .text('Here are your FlexFlow budgeting numbers:', 40, 40);

    // months
    var months = padRight('    ', NAME_LENGTH) + padLeft(reportData.months[0], AMOUNT_LENGTH) +
        padLeft(reportData.months[1], AMOUNT_LENGTH) + padLeft(reportData.months[2], AMOUNT_LENGTH) +
        padLeft(reportData.months[3], AMOUNT_LENGTH) + padLeft(reportData.months[4], AMOUNT_LENGTH) +
        padLeft(reportData.months[5], AMOUNT_LENGTH) + padLeft(reportData.months[6], AMOUNT_LENGTH) +
        padLeft(reportData.months[7], AMOUNT_LENGTH) + padLeft(reportData.months[8], AMOUNT_LENGTH) +
        padLeft(reportData.months[9], AMOUNT_LENGTH) + padLeft(reportData.months[10], AMOUNT_LENGTH) +
        padLeft(reportData.months[11], AMOUNT_LENGTH) + padLeft('Annual', AMOUNT_LENGTH);
    doc.font('Courier', 10)
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
                indent: 10,
                ellipsis: true
            });
    }

    // // flow items
    doc.fontSize(12)
        .moveDown()
        .text('Flow Accounts:');
    for (var i = 0; i < reportData.Flow.length; i++) {
        item = reportData.Flow[i];
        formattedItem = padRight(item.item_name, NAME_LENGTH) + padLeft(item.amount_1, AMOUNT_LENGTH) + padLeft(item.amount_2, AMOUNT_LENGTH) + padLeft(item.amount_3, AMOUNT_LENGTH) +
            padLeft(item.amount_4, AMOUNT_LENGTH) + padLeft(item.amount_5, AMOUNT_LENGTH) + padLeft(item.amount_6, AMOUNT_LENGTH) + padLeft(item.amount_7, AMOUNT_LENGTH) +
            padLeft(item.amount_8, AMOUNT_LENGTH) + padLeft(item.amount_9, AMOUNT_LENGTH) + padLeft(item.amount_10, AMOUNT_LENGTH) + padLeft(item.amount_11, AMOUNT_LENGTH) +
            padLeft(item.amount_12, AMOUNT_LENGTH) + padLeft(item.annual_amount, AMOUNT_LENGTH);
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
    for (var i = 0; i < reportData.Functional.length; i++) {
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
    for (var i = 0; i < reportData.Financial.length; i++) {
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

    // end and display the document in the iframe to the right
    doc.end();
    console.log('PDF created:', fileName);
}

function padRight(value, length) {
    if (value.length > length) {
        console.log(1, value, value.substring(0, length));
        return value.substring(0, length);
    } else {
        for (var i = value.length; i <= length; i++) {
            value += ' ';
        }
        return value;
    }
}

function formatPDFItem(item) {
    item = padRight(item.item_name, NAME_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft(item.item_amount, AMOUNT_LENGTH) +
        padLeft((item.item_amount * 12), 7);
    return item;
}

function padLeft(value, length) {
    var paddedValue = ("         " + value.toString()).slice(-length);
    return paddedValue;

}

module.exports = router;
