var express = require('express');
var router = express.Router();
var doc = require('../modules/pdf-report');

router.get("/", function(req, res) {
    console.log('***********  Starting PDF route  ***********');

    doc.makeClientPDF();
    console.log('***********  Ending PDF route  ***********');
    doc.done();
    next();

});

module.exports = router;
