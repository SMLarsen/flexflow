var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'file.pdf');

router.post("/", function(req, res) {
    // console.log("im here in send mail");
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
            filename: 'file.pdf',
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

        // console.log('Message sent: ' + info.response);
    });
});

module.exports = router;
