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
                        //console.log('retrieved profile', result.rows[0]);
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
                var queryString = 'SELECT item_month, item_year, item_amount, item_name FROM flow_item WHERE budget_id = $1 ORDER BY item_year, item_month';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error getting flow items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        //console.log('Flow items retrieved', result.rows);
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
                var queryString = 'SELECT item_year, item_month, SUM(item_amount) FROM flow_item WHERE budget_id = $1 GROUP BY item_year, item_month';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error getting flow items monthly totals', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows[0]);
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
                var queryString = 'SELECT SUM(item_amount) FROM flow_item WHERE budget_id = $1';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
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
                var queryString = 'DELETE FROM flow_item WHERE budget_id = $1 AND item_month = $2';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID, month], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error deleting flow items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Financial items deleted');
                    }
                });
            }
        });
    });
});
// *********************************** FLEX ITEM routes **************************
// Route: GET flex items for a budget
router.get("/flexitems", function (req, res) {
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
                var queryString = 'SELECT flex_amount, flex_name FROM flex_item WHERE budget_id = $1';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error getting flex items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Flex items retrieved');
                    }
                });
            }
        });
    });
});
// Route: GET flex monthly total for a budget
router.get("/flexitems/total", function (req, res) {
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
                var queryString = 'SELECT SUM(flex_amount) FROM flex_item WHERE budget_id = $1';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error getting flex items monthly total', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows[0]);
                        console.log('Flex items monthly total retrieved');
                    }
                });
            }
        });
    });
});
// Route: Insert flex items for a budget
router.post("/flexitems", function (req, res) {
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
                var queryString = 'INSERT INTO flex_item (budget_id, flex_amount, flex_name) VALUES ';
                if (req.body.length === 1) {
                    var oneItem = req.body[req.body.length - 1];
                    queryString += "(" + budgetID;
                    queryString += ", " + oneItem.flex_amount;
                    queryString += ", '" + oneItem.flex_name + "')";
                } else {
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
                }
                // console.log('queryString', queryString);
                client.query(queryString,
                    function (err, result) {
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
        });
    });
});
// Route: Delete flex items for a budget
router.delete("/flexitems", function (req, res) {
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                var queryString = 'DELETE FROM flex_item WHERE budget_id = $1';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error deleting flex items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Flex items deleted');
                    }
                });
            }
        });
    });
});
// *********************************** FUNCTIONAL ITEM routes **************************
// Route: GET functional items for a budget
router.get("/functionalitems", function (req, res) {
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
                var queryString = 'SELECT item_amount, item_name FROM functional_item WHERE budget_id = $1';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error getting functional items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Functional items retrieved');
                    }
                });
            }
        });
    });
});
// Route: GET functional monthly total for a budget
router.get("/functionalitems/total", function (req, res) {
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
                var queryString = 'SELECT SUM(item_amount) FROM functional_item WHERE budget_id = $1';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error getting functional items monthly total', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows[0]);
                        console.log('Functional items monthly total retrieved');
                    }
                });
            }
        });
    });
});
// Route: Insert functional items for a budget
router.post("/functionalitems", function (req, res) {
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
                // console.log('queryString', queryString);
                client.query(queryString,
                    function (err, result) {
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
        });
    });
});
// Route: Delete functional items for a budget
router.delete("/functionalitems", function (req, res) {
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                var queryString = 'DELETE FROM functional_item WHERE budget_id = $1';
                console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error deleting functional items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Functional items deleted');
                    }
                });
            }
        });
    });
});
// *********************************** FINANCIAL ITEM routes **************************
// Route: GET financial items for a budget
router.get("/financialitems", function (req, res) {
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
                var queryString = 'SELECT item_amount, item_name FROM financial_item WHERE budget_id = $1';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error getting financial items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Financial items retrieved');
                    }
                });
            }
        });
    });
});
// Route: GET financial monthly total for a budget
router.get("/financialitems/total", function (req, res) {
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
                var queryString = 'SELECT SUM(item_amount) FROM financial_item WHERE budget_id = $1';
                // console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error getting financial items monthly total', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows[0]);
                        console.log('Financial items monthly total retrieved');
                    }
                });
            }
        });
    });
});
// Route: Insert financial items for a budget
router.post("/financialitems", function (req, res) {
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
                // console.log('queryString', queryString);
                client.query(queryString,
                    function (err, result) {
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
        });
    });
});
// Route: Delete financial items for a budget
router.delete("/financialitems", function (req, res) {
    var userEmail = req.decodedToken.email;
    pg.connect(connectionString, function (err, client, done) {
        client.query('SELECT budget.id FROM budget, users WHERE budget.user_id = users.id AND users.email = $1', [userEmail], function (err, result) {
            done();
            if (err) {
                console.log('Error getting budgetID:', err);
                res.sendStatus(500);
            } else {
                var budgetID = result.rows[0].id;
                var queryString = 'DELETE FROM financial_item WHERE budget_id = $1';
                console.log('queryString:', queryString);
                client.query(queryString, [budgetID], function (err, result) {
                    done();
                    if (err) {
                        console.log('Error deleting financial items', err);
                        res.sendStatus(500);
                    } else {
                        res.send(result.rows);
                        console.log('Financial items deleted');
                    }
                });
            }
        });
    });
});
module.exports = router;
