var admin = require("firebase-admin");
var pg = require('pg');
var config = require('../modules/pg-config');

var pool = new pg.Pool(config.pg);

admin.initializeApp({
    credential: admin.credential.cert({
    "type": process.env.FIREBASE_SERVICE_ACCOUNT_TYPE,
    "project_id": process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
    "token_uri": process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL
  }),
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
                pool.connect()
                .then( function( client ) {
                    client.query('SELECT id FROM users WHERE email = $1', [decodedToken.email], function(err, result) {
                        if (err) {
                            console.log('Error getting userID in decoder:', err);
                            client.release();
                        } else {
                            if (result.rows.length > 0) {
                                req.userID = result.rows[0].id;
                                // console.log('userID:', req.userID);
                                client.query('SELECT id FROM budget WHERE user_id = $1', [req.userID],
                                    function(err, result) {
                                        if (err) {
                                            console.log('Error getting budgetID in decoder', err);
                                            client.release();
                                        } else {
                                            if (result.rows.length > 0) {
                                                req.budgetID = result.rows[0].id;
                                                // console.log('budgetID:', req.budgetID);
                                                client.release();
                                                next();
                                            } else {
                                              client.release();
                                                next();
                                            }
                                        }
                                    }
                                );
                            } else {
                              client.release();
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
