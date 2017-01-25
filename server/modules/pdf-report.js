var fs = require('fs');
var pg = require('pg');
var config = require('../modules/pg-config');

var pool = new pg.Pool(config.pg);

// var pool = new pg.Pool({
//     database: config.database
// });
var pdfDocument = require('pdfkit');
var doc = new pdfDocument;

var pdf = {
    flow: [],
    flex: [],
    functional: [],
    financial: [],
    comments: []
};

var makeClientPDF = function(req, res) {
    console.log('===========  Starting PDF module  ==========');
    console.log('req', req.userID, req.budgetID);
    return buildFlowMonths()
        .then(function(result) {
          console.log(1234143);
            // buildOtherMonths();
            return;
        });

    // doc.pipe(fs.createWriteStream('flexflow.pdf'));
    //
    // // draw some text
    // doc.font('Times-Roman')
    //     .fontSize(25)
    //     .text('Here is the flexflow PDF', 100, 100);
    //
    // doc.end();

    // next();
};

function buildFlowMonths(req, res) {
    pool.connect()
        .then(function(client) {
          console.log(22222222);
            var queryString = 'SELECT item_year, item_month, item_name, item_amount ';
            queryString += 'FROM budget_flow_item ';
            queryString += 'WHERE budget_id = $1 ';
            queryString += 'ORDER BY item_year, item_month, item_sort_sequence';
            console.log('queryString:', query);
            return client.query(queryString, [req.budgetID], function(err, result) {
                if (err) {
                    console.log('Error getting flow items reporting year', err);
                    client.release();
                    return;
                } else {
                    formatFlowItems(result.rows);
                    console.log('Flow items reporting year retrieved');
                    client.release();
                    return;
                }
            });
        });
}

function formatFlowItems(itemMonthArray) {
    var flowMonthColumn = [];
    var flowYear = [];
    for (var j = 1; j === 12; j++) {
        for (var i = 1; i === itemMonthArray.length / 12; i++) {
            flowMonthColumn.push(itemMonthArray[i]);
        }
        flowYear.push(flowMonthColumn);
    }
    console.log('formatFlowItems:', flowYear);
    return;
}

module.exports = {
    makeClientPDF: makeClientPDF
};
