var express = require('express');
var router = express.Router();
var pg = require('pg');
// var connectionString = require('../modules/database-config');

var config = require('../modules/pg-config');

var pool = new pg.Pool(config.pg);

// var pool = new pg.Pool({
//     database: config.database
// });

router.get("/privateData", function (req, res) {
	pool.connect()
	.then( function (client) {
		var userEmail = req.decodedToken.email;
		// console.log(userEmail);
		/* getting user by email */
		client.query('SELECT * FROM users WHERE email=$1', [userEmail], function (err, result) {
			if (err) {
				console.log('Error COMPLETING clearance_level query task', err);
				res.sendStatus(500);
				client.release();

			} else {
				pool.connect()
				.then( function ( client) {
					/* if user does not exist, add to user table */
					if (result.rowCount === 0) {
						client.query(
							'INSERT INTO users (email) VALUES ($1)', [userEmail],
							function (err, result) {
								if (err) {
									console.log('error on user Insert', err);
									res.sendStatus(500);
									client.release();

								} else {
									/* Retrieve new user to get id */
									client.query('SELECT * FROM users WHERE email=$1', [userEmail], function (err, result) {
										if (err) {
											console.log('Error Selecting new user', err);
											res.sendStatus(500);
											client.release();

										} else {
											var currentUser = result.rows[0];
											currentUser.newUser = true;
											// console.log('new User:', currentUser);
											res.send(currentUser);
											client.release();

										}
									});
								}
							});
					} else {
						var currentUser = result.rows[0];
						currentUser.newUser = false;
						// console.log('currentUser:', currentUser);
						res.send(currentUser);
						client.release();

					}
				});
			}
		});
	});
	router.get("/privateData", function (req, res) {
		pool.connect()
		.then( function ( client) {
			var userEmail = req.decodedToken.email;
			// console.log(userEmail);
			/* getting user by email */
			client.query('SELECT email, clearance_level FROM users WHERE email=$1', [userEmail], function (err, result) {
				if (err) {
					console.log('Error COMPLETING clearance_level query task', err);
					res.sendStatus(500);
					client.release();
				} else {
					pool.connect()
					.then(function (client) {
						/* if user does not exist, add to user table */
						if (result.rowCount === 0) {
							client.query(
								'INSERT INTO users (email) VALUES ($1)', [userEmail],
								function (err, result) {
									if (err) {
										console.log('error on user Insert', err);
										res.sendStatus(500);
										client.release();
									} else {
										/* Retrieve new user to get id */
										client.query('SELECT email, clearance_level FROM users WHERE email=$1', [userEmail], function (err, result) {
											if (err) {
												console.log('Error Selecting new user', err);
												res.sendStatus(500);
												client.release();
											} else {
												var currentUser = result.rows[0];
												currentUser.newUser = true;
												console.log('new User:', currentUser);
												res.send(currentUser);
												client.release();
											}
										});
									}
								});
						} else {
							var currentUser = result.rows[0];
							currentUser.newUser = false;
							console.log('currentUser:', currentUser);
							res.send(currentUser);
							client.release();
						}
					});
				}
			});
		});
	});
});
module.exports = router;
