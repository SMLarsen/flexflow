var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');
// *********************************** PROFILE routes **************************
router.get("/profile", function (req, res) {
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT id FROM users WHERE email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting userID:', err);
                res.sendStatus(500);
            } else {
                var userID = result.rows[0].id;
                client.query('SELECT id, budget_start_month, budget_start_year, monthly_take_home_amount, annual_salary, meeting_scheduled FROM budget WHERE user_id = $1', [userID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error COMPLETING profile select profile', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows[0]);
                        console.log('retrieved profile');
                    }
                });
            }
        });
    });
});
// Route: Post budget profile for a user
router.post("/profile", function (req, res) {
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT id FROM users WHERE email = $1', [userEmail], function (err, result) {
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
                    function (err, result) {
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
// Route: Update budget profile for a user
router.put("/profile", function (req, res) {
    var userEmail = req.decodedToken.email;
    // console.log('email:', userEmail, 'req:', req.body);
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT id FROM users WHERE email = $1', [userEmail], function (err, result) {
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
                    function (err, result) {
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
// Route: GET flow items for a budget
router.get("/flowitems", function (req, res) {
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                // console.log('results:', result.rows[0]);
                var queryString = 'SELECT category_name, budget_template_category_id, item_month, item_year, item_name, item_amount, item_sort_sequence ';
                queryString += 'FROM budget_template_category, budget_flow_item ';
                queryString += 'WHERE budget_template_category.id = budget_flow_item.budget_template_category_id ';
                queryString += 'AND budget_id = $1 ';
                queryString += 'ORDER BY budget_template_category_id, item_year, item_month, item_sort_sequence';
                console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting flow items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Flow items retrieved');
                    }
                });
            }
        });
    });
});
// Route: GET flow monthly totals for a budget
router.get("/flowitems/totalbymonth", function (req, res) {
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                // console.log('results:', result.rows[0]);
                var queryString = 'SELECT item_year, item_month, SUM(item_amount) ';
                queryString += 'FROM budget_flow_item ';
                queryString += 'WHERE budget_id = $1 ';
                queryString += 'GROUP BY item_year, item_month';
                console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting flow items monthly totals', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Flow items monthly totals retrieved');
                    }
                });
            }
        });
    });
});
// Route: GET flow yearly total for a budget
router.get("/flowitems/totalbyyear", function (req, res) {
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                // console.log('results:', result.rows[0]);
                var queryString = 'SELECT SUM(item_amount) ';
                queryString += 'FROM budget_flow_item ';
                queryString += 'WHERE budget_id = $1';
                console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting flow items yearly total', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows[0]);
                        console.log('Flow items yearly total retrieved');
                    }
                });
            }
        });
    });
});
// Route: Insert flow items for a budget
router.post("/flowitems", function (req, res) {
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                // console.log('body:', req.body);
                var queryString = 'INSERT INTO budget_flow_item (budget_id, budget_template_category_id, item_month, item_year, item_amount, item_name, item_sort_sequence) VALUES ';
                for (var i = 0; i < req.body.length - 1; i++) {
                    var item = req.body[i];
                    queryString += "(" + budgetID;
                    queryString += ", " + item.budget_template_category_id;
                    queryString += ", " + item.item_month;
                    queryString += ", " + item.item_year;
                    queryString += ", " + item.item_amount;
                    queryString += ", '" + item.item_name;
                    queryString += "', " + item.item_sort_sequence + "), ";
                }
                var lastItem = req.body[req.body.length - 1];
                queryString += "(" + budgetID;
                queryString += ", " + lastItem.budget_template_category_id;
                queryString += ", " + lastItem.item_month;
                queryString += ", " + lastItem.item_year;
                queryString += ", " + lastItem.item_amount;
                queryString += ", '" + lastItem.item_name;
                queryString += "', " + lastItem.item_sort_sequence + ")";
                // console.log('queryString', queryString);
                client.query(queryString,
                    function (err, result) {
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
        });
    });
});
// Route: Delete flow items for a budget
router.put("/flowitems", function (req, res) {
    var userEmail = req.decodedToken.email;
    // console.log('email:', userEmail, 'req:', req.body);
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT id FROM users WHERE email = $1', [userEmail], function (err, result) {
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
                    function (err, result) {
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
router.delete("/flowitems/:month", function (req, res) {
    var userEmail = req.decodedToken.email;
    var month = req.params.month;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                var queryString = 'DELETE FROM budget_flow_item WHERE budget_id = $1 AND item_month = $2';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID, month], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error deleting flow items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Flow items deleted');
                    }
                });
            }
        });
    });
});

// *********************************** FLEX, FINANCIAL, and FUNCTIONAL ITEM routes **************************

// Route: GET items for a budget
router.get("/items/:categoryID", function(req, res) {
    var categoryID = req.params.categoryID;
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                // console.log('results:', result.rows[0]);
                var queryString = 'SELECT category_name, budget_template_category_id, item_name, item_amount, item_sort_sequence ';
                queryString += 'FROM budget_template_category, budget_item ';
                queryString += 'WHERE budget_template_category.id = budget_item.budget_template_category_id ';
                queryString += 'AND budget_id = $1 ';
                queryString += 'AND budget_template_category_id = $2 ';
                queryString += 'ORDER BY item_sort_sequence';
                console.log('queryString:', queryString);
                client.query(queryString, [budgetID, categoryID], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting budget items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Budget items retrieved');
                    }
                });
            }
        });
    });
});

// Route: GET total for a budget category
router.get("/items/total/:categoryID", function(req, res) {
    var categoryID = req.params.categoryID;
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                // console.log('results:', result.rows[0]);
                var queryString = 'SELECT SUM(item_amount) FROM budget_item ';
                queryString += 'WHERE budget_id = $1 ';
                queryString += 'AND budget_template_category_id = $2';
                console.log('queryString:', queryString);
                client.query(queryString, [budgetID, categoryID], function(err, result) {
                    done();
                    if (err) {
                        console.log('Error getting budget items monthly total', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows[0]);
                        console.log('Budget items monthly total retrieved');
                    }
                });
            }
        });
    });
});

// Route: Insert budget items for a budget category
router.post("/items", function(req, res) {
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                // console.log('body:', req.body);
                var queryString = 'INSERT INTO budget_item (budget_id, budget_template_category_id, item_name, item_amount, item_sort_sequence) VALUES ';
                if (req.body.length === 1) {
                    var oneItem = req.body[req.body.length - 1];
                    queryString += "(" + budgetID;
                    queryString += ", " + oneItem.budget_template_category_id;
                    queryString += ", '" + oneItem.item_name;
                    queryString += "', " + oneItem.item_amount;
                    queryString += ", " + oneItem.item_sort_sequence + ")";
                } else {
                    for (var i = 0; i < req.body.length - 1; i++) {
                        var item = req.body[i];
                        // replace real values with $values
                        queryString += "(" + budgetID;
                        queryString += ", " + item.budget_template_category_id;
                        queryString += ", '" + item.item_name;
                        queryString += "', " + item.item_amount;
                        queryString += ", " + item.item_sort_sequence + "),";
                    }
                    var lastItem = req.body[req.body.length - 1];
                    queryString += "(" + budgetID;
                    queryString += ", " + lastItem.budget_template_category_id;
                    queryString += ", '" + lastItem.item_name;
                    queryString += "', " + lastItem.item_amount;
                    queryString += ", " + lastItem.item_sort_sequence + ")";

                }
                // console.log('queryString', queryString);
                client.query(queryString,
                    function (err, result) {
                        done();
                        if (err) {
                            console.log('Error Inserting budget items', err);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(201);
                            console.log('Budget items inserted');
                        }
                    }
                );
            }
        });
    });
});

// Route: Delete budget items for a budget
router.delete("/items/:categoryID", function(req, res) {
    var categoryID = req.params.categoryID;
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                var queryString = 'DELETE FROM budget_item WHERE budget_id = $1 AND budget_template_category_id = $2';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID, categoryID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error deleting budget items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Budget items deleted');
                    }
                });
            }
        });
    });
});
module.exports = router;
