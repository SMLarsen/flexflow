var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var decoder = require('./modules/decoder');
var privateData = require('./routes/private-data');
var users = require('./routes/users');
var templates = require('./routes/template');
var mail = require('./routes/mail');
var budget = require('./routes/budget');

var portDecision = process.env.PORT || 5000;

app.get('/', function(req, res){
  res.sendFile(path.resolve('./public/views/index.html'));
});

app.use(express.static('public'));
app.use(bodyParser.json());

app.use("/template", templates);
app.use("/mail", mail);

// Decodes the token in the request header and attaches the decoded token to req.decodedToken on the request.
app.use(decoder.token);

/* Whatever you do below this is protected by your authentication. */

// This is the route for your secretData. The request gets here after it has been authenticated.
app.get("/privateData", privateData);
app.use('/users', users);
app.use("/budget", budget);

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});
