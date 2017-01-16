var fs = require('fs');
var pdfDocument = require('pdfkit');
var doc = new pdfDocument;

var pdf = {
    flow = [],
    flex = [],
    functional = [],
    financial = [],
    comments = []
};

var makeClientPDF = function(req, res, next) {
    console.log('===========  Starting PDF module  ==========');
    build


    doc.pipe(fs.createWriteStream('flexflow.pdf'));

    // draw some text
    doc.font('Times-Roman')
        .fontSize(25)
        .text('Here is the flexflow PDF', 100, 100);

    doc.end();

    // next();
};

module.exports = {
    makeClientPDF: makeClientPDF
};
