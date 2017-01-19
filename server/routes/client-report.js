var express = require('express');
var router = express.Router();
var pg = require('pg');
var config = require('../modules/pg-config');
var pdfDocument = require('pdfkit');
var fs = require('fs');

var pool = new pg.Pool({
    database: config.database
});

var reportData = {};

console.log('Report route starting -------------------');

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
                    reportData.profile = result.rows[0];
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
                    reportData.comment = result.rows;
                    client.release();
                    res.send(reportData.Flow);
                    next();
                }
            });
        });
});

// Route: GET comments for a budget
router.get("/", function(req, res, next) {
    createPDF();
});


function formatItems(itemArray) {
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
});


function createPDF() {
    console.log('starting createPDF');
    var doc = new pdfDocument({
        layout: 'landscape'
    });
    var fileName = 'flexflow-' + budgetID + '.pdf';
    doc.pipe(fs.createWriteStream("./server/pdf/" + fileName));

    // draw some text
    doc.fontSize(16)
        .text('Here are your FlexFlow budgeting numbers:', 40, 40);

    // flex items
    doc.fontSize(12)
        .moveDown()
        .text('Flex Accounts:');
    for (var i = 0; i < reportData.Flex.length; i++) {
        item = reportData.Flex[i];
        formatItem = item.item_name + " - $" + item.item_amount;
        doc.font('Courier', 10)
            .moveDown()
            .text(formatItem, {
                width: 412,
                align: 'justify',
                indent: 30,
                columns: 2,
                height: 300,
                ellipsis: true
            });
    }

    // // flow items
    doc.fontSize(12)
        .moveDown()
        .text('Flow Accounts:');
    for (var i = 0; i < reportData.Flow.length; i++) {
        item = reportData.Flow[i];
        formatItem = item.item_name + " - $" + item.amount_1 + ', ' + item.amount_2 + ', ' + item.amount_3 +
            ', ' + item.amount_4 + ', ' + item.amount_5 + ', ' + item.amount_6 + ', ' + item.amount_7 +
            ', ' + item.amount_8 + ', ' + item.amount_9 + ', ' + item.amount_10 + ', ' + item.amount_11 +
            ', ' + item.amount_12 + ', ' + item.annual_amount;
        doc.font('Times-Roman', 10)
            .moveDown()
            .text(formatItem, {
                width: 1200,
                align: 'justify',
                indent: 30,
                // columns: 14,
                height: 200,
                ellipsis: true
            });
    }

    // functional items
    doc.fontSize(12)
        .moveDown()
        .text('Functional Accounts:');
    for (var i = 0; i < reportData.Functional.length; i++) {
        item = reportData.Functional[i];
        formatItem = item.item_name + " - $" + item.item_amount;
        doc.font('Times-Roman', 10)
            .moveDown()
            .text(formatItem, {
                width: 412,
                align: 'justify',
                indent: 30,
                columns: 2,
                height: 300,
                ellipsis: true
            });
    }

    // Financial items
    doc.fontSize(12)
        .moveDown()
        .text('Financial Accounts:');
    for (var i = 0; i < reportData.Financial.length; i++) {
        item = reportData.Financial[i];
        formatItem = item.item_name + " - $" + item.item_amount;
        doc.font('Times-Roman', 10)
            .moveDown()
            .text(formatItem, {
                width: 412,
                align: 'justify',
                indent: 30,
                columns: 2,
                height: 300,
                ellipsis: true
            });
    }

    // doc.text('Flexer: ' + reportData.Flex[0].item_name + " - $" + reportData.Flex[0].item_amount, 100, 300)
    //     .font('Times-Roman', 13)
    //     .moveDown()
    //     .text(lorem, {
    //         width: 412,
    //         align: 'justify',
    //         indent: 30,
    //         columns: 2,
    //         height: 300,
    //         ellipsis: true
    //     });

    // end and display the document in the iframe to the right
    doc.end();
    console.log('PDF created:', fileName);
}

function spacer(value, length) {
    if (value.length > length) {
        console.log(1, value, value.substring(0, length));
        return value.substring(0, length);
    } else {
        if (value.length === length) {
            return value;
        } else {
            var spacesNeeded = length - value.length;
            for (var i = 0; i < spacesNeeded; i++) {
                value += ' ';
            }
        }
    }
}

module.exports = router;
