var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

// *********************************** PROFILE routes **************************
router.get("/profile/:email", function(req, res) {
    var userEmail = req.params.email;
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT id FROM users WHERE email = $1', [userEmail], function(err, result) {
            done();
            if (err) {
                console.log('Error getting userID:', err);
                res.sendStatus(500);
            } else {
                var userID = result.rows[0].id;
                client.query('SELECT id, budget_start_month, budget_start_year, monthly_take_home_amount, annual_salary, meeting_scheduled FROM budget WHERE user_id = $1', [userID], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error COMPLETING profile select profile', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows[0]);
                        console.log('retrieved profile', result.rows[0]);
                    }
                });
            }
        });
    });
});

router.post("/profile/:email", function(req, res) {
    var userEmail = req.params.email;
    // console.log('email:', userEmail, 'req:', req.body);
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT id FROM users WHERE email = $1', [userEmail], function(err, result) {
            done();
            if (err) {
                console.log('Error getting userID:', err);
                res.sendStatus(500);
            } else {
                var userID = result.rows[0].id;
                var queryString = 'INSERT INTO budget ';
                queryString += '(user_id, budget_start_month, budget_start_year, monthly_take_home_amount, annual_salary,';
                queryString += ' meeting_scheduled) ';
                queryString += 'VALUES ($1, $2, $3, $4, $5, $6)';
                client.query(queryString, [userID, req.body.budget_start_month, req.body.budget_start_year, req.body.monthly_take_home_amount, req.body.annual_salary, req.body.meeting_scheduled],
                    function(err, result) {
                        done();
                        if (err) {
                            console.log('Error Inserting profile', err);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(201);
                            console.log('Profile inserted');
                        }
                    }
                );
            }
        });
    });
});

router.put("/profile/:email", function(req, res) {
    var userEmail = req.params.email;
    console.log('email:', userEmail, 'req:', req.body);
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT id FROM users WHERE email = $1', [userEmail], function(err, result) {
            done();
            if (err) {
                console.log('Error getting userID:', err);
                res.sendStatus(500);
            } else {
                var userID = result.rows[0].id;
                var queryString = 'UPDATE budget SET ';
                queryString += 'budget_start_month = $1, budget_start_year = $2, monthly_take_home_amount = $3,';
                queryString += ' annual_salary = $4, meeting_scheduled = $5 ';
                queryString += 'WHERE user_id = $6';
                client.query(queryString, [req.body.budget_start_month, req.body.budget_start_year, req.body.monthly_take_home_amount, req.body.annual_salary, req.body.meeting_scheduled, userID],
                    function(err, result) {
                        done();
                        if (err) {
                            console.log('Error Updating profile', err);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(201);
                            console.log('Profile updated');
                        }
                    }
                );
            }
        });
    });
});

// *********************************** FLOw ITEM routes **************************
router.get("/flowitems/:email", function(req, res) {
    var userEmail = req.params.email;
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function(err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                // console.log('results:', result.rows[0]);
                var queryString = 'SELECT item_month, item_year, item_amount, item_name FROM flow_item WHERE budget_id = $1 ORDER BY item_year, item_month';
                console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting flow items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Flow items retrieved', result.rows);
                    }
                });
            }
        });
    });
});

router.post("/flowitems/:email", function(req, res) {
    var userEmail = req.params.email;
    // console.log('email:', userEmail, 'req:', req.body);
    pg.connect(connectionString, function(err, client, done) {
            client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting budgetID:', err);
                        res.sendStatus(500);
                    } else {
                        var budgetID = result.rows[0].id;
                        // console.log('body:', req.body);
                        var queryString = 'INSERT INTO flow_item (budget_id, item_month, item_year, item_amount, item_name) VALUES ';
                        for (var i = 0; i < req.body.length - 1; i++) {
                            var item = req.body[i];
                            // replace real values with $values
                            queryString += "(" + budgetID;
                            queryString += ", " + item.item_month;
                            queryString += ", " + item.item_year;
                            queryString += ", " + item.item_amount;
                            queryString += ", '" + item.item_name + "'), ";
                        }
                        var lastItem = req.body[req.body.length - 1];
                        queryString += "(" + budgetID;
                        queryString += ", " + lastItem.item_month;
                        queryString += ", " + lastItem.item_year;
                        queryString += ", " + lastItem.item_amount;
                        queryString += ", '" + lastItem.item_name + "')";
                        console.log('queryString', queryString);
                        client.query(queryString,
                            function(err, result) {
                                done();
                                if (err) {
                                    console.log('Error Inserting flowitems', err);
                                    res.sendStatus(500);
                                } else {
                                    res.sendStatus(201);
                                    console.log('Flow items inserted');
                                }
                            }
                        );
                    }
                }
            );
    });
});

router.put("/flowitems/:email", function(req, res) {
    var userEmail = req.params.email;
    console.log('email:', userEmail, 'req:', req.body);
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT id FROM users WHERE email = $1', [userEmail], function(err, result) {
            done();
            if (err) {
                console.log('Error getting userID:', err);
                res.sendStatus(500);
            } else {
                var userID = result.rows[0].id;
                var queryString = 'UPDATE budget SET ';
                queryString += 'budget_start_month = $1, budget_start_year = $2, monthly_take_home_amount = $3,';
                queryString += ' annual_salary = $4, meeting_scheduled = $5 ';
                queryString += 'WHERE user_id = $6';
                client.query(queryString, [req.body.budget_start_month, req.body.budget_start_year, req.body.monthly_take_home_amount, req.body.annual_salary, req.body.meeting_scheduled, userID],
                    function(err, result) {
                        done();
                        if (err) {
                            console.log('Error Updating profile', err);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(201);
                            console.log('Profile updated');
                        }
                    }
                );
            }
        });
    });
});

// *********************************** FLEX ITEM routes **************************
router.get("/flexitems/:email", function(req, res) {
    var userEmail = req.params.email;
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function(err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                // console.log('results:', result.rows[0]);
                var queryString = 'SELECT flex_amount, flex_name FROM flex_item WHERE budget_id = $1';
                console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting flex items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Flex items retrieved', result.rows);
                    }
                });
            }
        });
    });
});

router.post("/flexitems/:email", function(req, res) {
    var userEmail = req.params.email;
    // console.log('email:', userEmail, 'req:', req.body);
    pg.connect(connectionString, function(err, client, done) {
            client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting budgetID:', err);
                        res.sendStatus(500);
                    } else {
                        var budgetID = result.rows[0].id;
                        // console.log('body:', req.body);
                        var queryString = 'INSERT INTO flex_item (budget_id, flex_amount, flex_name) VALUES ';
                        for (var i = 0; i < req.body.length - 1; i++) {
                            var item = req.body[i];
                            // replace real values with $values
                            queryString += "(" + budgetID;
                            queryString += ", " + item.flex_amount;
                            queryString += ", '" + item.flex_name + "'), ";
                        }
                        var lastItem = req.body[req.body.length - 1];
                        queryString += "(" + budgetID;
                        queryString += ", " + lastItem.flex_amount;
                        queryString += ", '" + lastItem.flex_name + "')";
                        console.log('queryString', queryString);
                        client.query(queryString,
                            function(err, result) {
                                done();
                                if (err) {
                                    console.log('Error Inserting flexitems', err);
                                    res.sendStatus(500);
                                } else {
                                    res.sendStatus(201);
                                    console.log('Flex items inserted');
                                }
                            }
                        );
                    }
                }
            );
    });
});

// *********************************** FUNCTIONAL ITEM routes **************************
router.get("/functionalitems/:email", function(req, res) {
    var userEmail = req.params.email;
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function(err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                // console.log('results:', result.rows[0]);
                var queryString = 'SELECT item_amount, item_name FROM functional_item WHERE budget_id = $1';
                console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting functional items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Functional items retrieved', result.rows);
                    }
                });
            }
        });
    });
});

router.post("/functionalitems/:email", function(req, res) {
    var userEmail = req.params.email;
    // console.log('email:', userEmail, 'req:', req.body);
    pg.connect(connectionString, function(err, client, done) {
            client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting budgetID:', err);
                        res.sendStatus(500);
                    } else {
                        var budgetID = result.rows[0].id;
                        // console.log('body:', req.body);
                        var queryString = 'INSERT INTO functional_item (budget_id, item_amount, item_name) VALUES ';
                        for (var i = 0; i < req.body.length - 1; i++) {
                            var item = req.body[i];
                            // replace real values with $values
                            queryString += "(" + budgetID;
                            queryString += ", " + item.item_amount;
                            queryString += ", '" + item.item_name + "'), ";
                        }
                        var lastItem = req.body[req.body.length - 1];
                        queryString += "(" + budgetID;
                        queryString += ", " + lastItem.item_amount;
                        queryString += ", '" + lastItem.item_name + "')";
                        console.log('queryString', queryString);
                        client.query(queryString,
                            function(err, result) {
                                done();
                                if (err) {
                                    console.log('Error Inserting functionalitems', err);
                                    res.sendStatus(500);
                                } else {
                                    res.sendStatus(201);
                                    console.log('Functional items inserted');
                                }
                            }
                        );
                    }
                }
            );
    });
});

// *********************************** FINANCIAL ITEM routes **************************
router.get("/financialitems/:email", function(req, res) {
    var userEmail = req.params.email;
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function(err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                // console.log('results:', result.rows[0]);
                var queryString = 'SELECT item_amount, item_name FROM financial_item WHERE budget_id = $1';
                console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting financial items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Financial items retrieved', result.rows);
                    }
                });
            }
        });
    });
});

router.post("/financialitems/:email", function(req, res) {
    var userEmail = req.params.email;
    // console.log('email:', userEmail, 'req:', req.body);
    pg.connect(connectionString, function(err, client, done) {
            client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting budgetID:', err);
                        res.sendStatus(500);
                    } else {
                        var budgetID = result.rows[0].id;
                        // console.log('body:', req.body);
                        var queryString = 'INSERT INTO financial_item (budget_id, item_amount, item_name) VALUES ';
                        for (var i = 0; i < req.body.length - 1; i++) {
                            var item = req.body[i];
                            // replace real values with $values
                            queryString += "(" + budgetID;
                            queryString += ", " + item.item_amount;
                            queryString += ", '" + item.item_name + "'), ";
                        }
                        var lastItem = req.body[req.body.length - 1];
                        queryString += "(" + budgetID;
                        queryString += ", " + lastItem.item_amount;
                        queryString += ", '" + lastItem.item_name + "')";
                        console.log('queryString', queryString);
                        client.query(queryString,
                            function(err, result) {
                                done();
                                if (err) {
                                    console.log('Error Inserting financialitems', err);
                                    res.sendStatus(500);
                                } else {
                                    res.sendStatus(201);
                                    console.log('Financial items inserted');
                                }
                            }
                        );
                    }
                }
            );
    });
});


module.exports = router;
