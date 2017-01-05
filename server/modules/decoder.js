var admin = require("firebase-admin");

console.log('Enter decoder.js');

admin.initializeApp({
  credential: admin.credential.cert("./server/firebase-service-account.json"),
  databaseURL: "https://travelogger-66f9b.firebaseio.com"
});

/* This is where the magic happens. We pull the id_token off of the request,
verify it against our firebase service account private_key.
Then we add the decodedToken */
var tokenDecoder = function(req, res, next){
  admin.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    // Adding the decodedToken to the request so that downstream processes can use it
    req.decodedToken = decodedToken;
    next();
  })
  .catch(function(error) {
    // If the id_token isn't right, you end up in this callback function
    // Here we are returning a forbidden error
    console.log('User token could not be verified');
    res.send(403);
  });
}

module.exports = { token: tokenDecoder };
