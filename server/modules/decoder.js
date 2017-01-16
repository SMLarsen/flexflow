var admin = require("firebase-admin");
var pg = require('pg');
var connectionString = require('../modules/database-config');

admin.initializeApp({
    credential: admin.credential.cert("./server/firebase-service-account.json"),
    databaseURL: "https://flexflow-7b2c8.firebaseio.com/" // replace this line with your URL
});

// Pull the id_token off of the request, verify it against our firebase service account private_key.
// Then add the decodedToken
var tokenDecoder = function(req, res, next) {
    if (req.headers.id_token) {
        admin.auth().verifyIdToken(req.headers.id_token)
            .then(function(decodedToken) {
                // Adding the decodedToken to the request so that downstream processes can use it
                req.decodedToken = decodedToken;
                // Try to get userID
                pg.connect(connectionString, function(err, client, done) {
                    client.query('SELECT id FROM users WHERE email = $1', [decodedToken.email], function(err, result) {
                        done();
                        if (err) {
                            console.log('Error getting userID in decoder:', err);
                        } else {
                            if (result.rows.length > 0) {
                                req.userID = result.rows[0].id;
                                // console.log('userID:', req.userID);
                                client.query('SELECT id FROM budget WHERE user_id = $1', [req.userID],
                                    function(err, result) {
                                        done();
                                        if (err) {
                                            console.log('Error getting budgetID in decoder', err);
                                        } else {
                                            if (result.rows.length > 0) {
                                                req.budgetID = result.rows[0].id;
                                                // console.log('budgetID:', req.budgetID);
                                                next();
                                            } else {
                                                next();
                                            }
                                        }
                                    }
                                );
                            } else {
                              next();
                            }
                        }
                    });
                });
            })
            .catch(function(error) {
                // If the id_token isn't right, return forbidden error
                console.log('User token could not be verified');
                res.sendStatus(403);
            });
    } else {
        // Hit when user does not send back an idToken in the header
        res.sendStatus(403);
    }
};

module.exports = {
    token: tokenDecoder
};
