require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var decoder = require('./modules/decoder');
var clientReport = require('./routes/client-report');
var csv = require('./routes/csv');
var privateData = require('./routes/private-data');
var admin = require('./routes/admin');
var templates = require('./routes/template');
var profile = require('./routes/profile');
var item = require('./routes/item');
var total = require('./routes/total');
var mail = require('./routes/mail');
var comment = require('./routes/comment');

var portDecision = process.env.PORT || 5000;

app.get('/', function(req, res){
  res.sendFile(path.resolve('./public/views/index.html'));
});

app.use(express.static('public'));
app.use(bodyParser.json());

app.use("/template", templates);
app.use("/admin", admin);

// Decodes the token in the request header and attaches the decoded token to req.decodedToken on the request.
app.use(decoder.token);

/* Whatever you do below this is protected by your authentication. */

// This is the route for your secretData. The request gets here after it has been authenticated.
app.get("/privateData", privateData);
app.use("/profile", profile);
app.use("/item", item);
app.use("/total", total);
app.use("/mail", mail);
app.use("/comment", comment);
app.use("/client-report", clientReport);
app.use("/csv", csv);

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});
