var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.get('/send', function(req, res){
  console.log("im here in send mail");

  // create reusable transporter object using SMTP transport
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    }
  });

  var mailOptions = {
    from: 'Hien Le ✔ <lhien11@gmail.com>', // sender address
    to: 'lhien04@gmail.com, lhien4635@gmail.com', // list of receivers
    subject: 'Website Submission', // Subject line
    // text: 'You have a submission with the folowing details... Name: '+req.body.name + ' Email: '+req.body.email+ ' Message: '+req.body.message, // plaintext body
    // html: '<p>You have a submission with the folowing details... </p> <ul><li>Name: '+req.body.name + ' </li><li>Email: '+req.body.email+ ' </li><li>Message: '+req.body.message+'</li></ul>'// html body
    text: 'You have a submission with the following details',
    html: '<p>You have a submission with the folowing details... </p>'
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        res.redirect('/');
        return console.log(error);
    }
    res.sendStatus(200);
    console.log('Message sent: ' + info.response);

});
 res.sendStatus(200);

});

module.exports = router;
