/*jshint esversion: 6 */
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const decoder = require('./modules/decoder');
const clientReport = require('./routes/client-report');
const csv = require('./routes/csv');
const privateData = require('./routes/private-data');
const admin = require('./routes/admin');
const templates = require('./routes/template');
const profile = require('./routes/profile');
const item = require('./routes/item');
const total = require('./routes/total');

const portDecision = process.env.PORT || 5000;

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
app.use("/client-report", clientReport);
app.use("/csv", csv);

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});