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

var reportData = {};

console.log('Report route starting -------------------');

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
                    res.send(reportData);
                    next();
                }
            });
        });
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
    reportData.Flow = tempCategoryArray;
}

// Route: GET comments for a budget
// router.get("/", function(req, res, next) {
//     createPDF();
// });


// function createPDF() {
//     console.log('starting createPDF');
//     var doc = new pdfDocument;
//     doc.pipe(fs.createWriteStream('./flexflow.pdf'));
//
//     // draw some text
//     doc.fontSize(16)
//         .text('Here are your FlexFlow budgeting numbers:', 40, 40);
//
//     // flex items
//     doc.fontSize(12)
//       .moveDown()
//         .text('Flex Accounts:');
//     for (var i = 0; i < reportData.Flex.length; i++) {
//         item = reportData.Flex[i];
//         formatItem = item.item_name + " - $" + item.item_amount;
//         doc.font('Times-Roman', 10)
//             .moveDown()
//             .text(formatItem, {
//                 width: 412,
//                 align: 'justify',
//                 indent: 30,
//                 columns: 2,
//                 height: 300,
//                 ellipsis: true
//             });
//     }
//
//             // flow items
//             doc.fontSize(12)
//               .moveDown()
//                 .text('Flow Accounts:');
//             for (var i = 0; i < reportData.Flow.length; i++) {
//                 // item = reportData.Flow[i];
//                 // formatItem = item[0].item_name + " - $" + item[0].item_amount + ', ' + item[1].item_amount + ', ' + item[2].item_amount +
//                 // ', ' + item[3].item_amount + ', ' + item[4].item_amount + ', ' + item[5].item_amount + ', ' + item[6].item_amount +
//                 // ', ' + item[7].item_amount + ', ' + item[8].item_amount + ', ' + item[9].item_amount + ', ' + item[10].item_amount + ', ' +
//                 // item[11].item_amount + ', ' + item[12].item_amount;
//                 item = reportData.Flow[i];
//                 formatItem = item[0].item_name + " - $" + item[0].item_amount + ', ' + item[1].item_amount + ', ' + item[2].item_amount +
//                 ', ' + item[3].item_amount + ', ' + item[4].item_amount + ', ' + item[5].item_amount + ', ' + item[6].item_amount +
//                 ', ' + item[7].item_amount + ', ' + item[8].item_amount + ', ' + item[9].item_amount + ', ' + item[10].item_amount + ', ' +
//                 item[11].item_amount + ', ' + item[12].item_amount;
//                 doc.font('Times-Roman', 10)
//                     .moveDown()
//                     .text([item[0].item_name item[0].item_amount], {
//                         width: 1200,
//                         align: 'justify',
//                         indent: 30,
//                         columns: 14,
//                         height: 200,
//                         ellipsis: true
//                     })
//
//                     .text(item[1].item_amount)
//                     .text(item[2].item_amount)
//                     .text(item[3].item_amount)
//                     ;
//             }
//
//         // functional items
//         doc.fontSize(12)
//           .moveDown()
//             .text('Functional Accounts:');
//         for (var i = 0; i < reportData.Functional.length; i++) {
//             item = reportData.Functional[i];
//             formatItem = item.item_name + " - $" + item.item_amount;
//             doc.font('Times-Roman', 10)
//                 .moveDown()
//                 .text(formatItem, {
//                     width: 412,
//                     align: 'justify',
//                     indent: 30,
//                     columns: 2,
//                     height: 300,
//                     ellipsis: true
//                 });
//         }
//
//             // Financial items
//             doc.fontSize(12)
//               .moveDown()
//                 .text('Financial Accounts:');
//             for (var i = 0; i < reportData.Financial.length; i++) {
//                 item = reportData.Financial[i];
//                 formatItem = item.item_name + " - $" + item.item_amount;
//                 doc.font('Times-Roman', 10)
//                     .moveDown()
//                     .text(formatItem, {
//                         width: 412,
//                         align: 'justify',
//                         indent: 30,
//                         columns: 2,
//                         height: 300,
//                         ellipsis: true
//                     });
//             }
//
//     // doc.text('Flexer: ' + reportData.Flex[0].item_name + " - $" + reportData.Flex[0].item_amount, 100, 300)
//     //     .font('Times-Roman', 13)
//     //     .moveDown()
//     //     .text(lorem, {
//     //         width: 412,
//     //         align: 'justify',
//     //         indent: 30,
//     //         columns: 2,
//     //         height: 300,
//     //         ellipsis: true
//     //     });
//
//     // end and display the document in the iframe to the right
//     doc.end();
//     // stream.on('finish', function() {
//     //   blob = stream.toBlob('application/pdf');
//     // });
// }

var lastCSV = false;
var csvContent = '';
// Route: Create CSV
router.get("/", function(req, res, next) {
    var flexCSV = '';
    console.log('createCSV Flex');
    converter.json2csv(reportData.Flex, json2csvCallback);
    console.log('csvContent:', csvContent);
    next();
});

// Route: Create CSV
router.get("/", function(req, res, next) {
    var flexCSV = '';
    console.log('createCSV Functional');
    converter.json2csv(reportData.Functional, json2csvCallback);
    console.log('csvContent:', csvContent);
    next();
});

// Route: Create CSV
router.get("/", function(req, res, next) {
    console.log('createCSV Functional');
    lastCSV = true;
    converter.json2csv(reportData.Financial, json2csvCallback);
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
