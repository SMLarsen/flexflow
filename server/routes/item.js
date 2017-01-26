/*jshint esversion: 6 */

var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var pg = require('pg');

var config = require('../modules/pg-config');

var pool = new pg.Pool(config.pg);


// *********************************** FLOw ITEM routes **************************

// Route: GET flow items for a budget
router.get("/flowitems", function(req, res) {
    pool.connect()
        .then(function(client) {
            var queryString = 'SELECT category_name, budget_template_category_id, item_month, item_year, item_name, item_img_src, item_amount, item_sort_sequence ';
            queryString += 'FROM budget_template_category, budget_flow_item ';
            queryString += 'WHERE budget_template_category.id = budget_flow_item.budget_template_category_id ';
            queryString += 'AND budget_id = $1 ';
            queryString += 'ORDER BY budget_template_category_id, item_year, item_month, item_sort_sequence';
            client.query(queryString, [req.budgetID])
                .then(function(result) {
                    client.release();
                    res.send(result.rows);
                }).catch(function(err) {
                    // error
                    client.release();
                    console.log('Error on get flowitems ', err);
                }); // end inner then

        }); // end firs tthen

}); // end pool.connect

// Route: GET flow items for a budget within certain month
router.get("/flowitems/:month", function(req, res) {
    var month = req.params.month;
    pool.connect()
        .then(function(client) {
            var queryString = 'SELECT category_name, budget_template_category_id, item_month, item_year, item_name, item_img_src, item_amount, item_sort_sequence ';
            queryString += 'FROM budget_template_category, budget_flow_item ';
            queryString += 'WHERE budget_template_category.id = budget_flow_item.budget_template_category_id ';
            queryString += 'AND budget_id = $1 AND item_month = $2';
            queryString += 'ORDER BY budget_template_category_id, item_year, item_month, item_sort_sequence';
            client.query(queryString, [req.budgetID, month])
                .then(function(result) {
                    client.release();
                    res.send(result.rows);
                }).catch(function(err) {
                    // error
                    client.release();
                    console.log('Error on get flowitems ', err);
                }); // end inner then

        }); // end firs tthen

}); // end pool.connect

// Route: Update flow items for a budget within certain month
router.put("/flowitems/:month", function(req, res) {
    var month = req.params.month;
    var data = [
        item_name = req.body.item_name,
        item_amount = req.body.item_amount,
        item_year = req.body.item_year
    ];
    pool.connect()
        .then(function(client) {
            client.query('UPDATE budget_flow_item SET item_name = $1, item_amount = $2 WHERE budget_id = $3 AND item_month = $4 AND item_name = $5', [req.body.item_name, req.body.item_amount, req.budgetID, month, req.body.item_name])
                .then(function(result) {
                    client.release();
                    res.sendStatus(200);
                }).catch(function(err) {
                    // error
                    client.release();
                    console.log('Error on EDIT flowitems', err);
                    res.sendStatus(500);
                });
        });
});
// Route: Update flow items for a budget within certain month
router.put("/flowitems/:month/:item_name", function(req, res) {
    var month = req.params.month;
    var data = [
        item_name = req.body.item_name,
        item_amount = req.body.item_amount,
        item_year = req.body.item_year
    ];
    pool.connect()
        .then(function(client) {
            client.query('UPDATE budget_flow_item SET item_amount = $1 WHERE budget_id = $2 AND item_month = $3 AND item_name = $4', [req.body.item_amount, req.budgetID, req.params.month, req.params.item_name])
                .then(function(result) {
                    client.release();
                    res.sendStatus(200);
                }).catch(function(err) {
                    // error
                    client.release();
                    console.log('Error on EDIT flowitems', err);
                    res.sendStatus(500);
                });
        });
});

// Route: Insert flow items for a budget
router.post("/flowitems", function(req, res) {
    pool.connect()
        .then(function(client) {
            var queryString = 'INSERT INTO budget_flow_item (budget_id, budget_template_category_id, item_month, item_year, item_img_src, item_amount, item_name, item_sort_sequence) VALUES ';
            for (var i = 0; i < req.body.length - 1; i++) {
                var item = req.body[i];
                queryString += "(" + req.budgetID;
                queryString += ", " + 1;
                queryString += ", " + item.item_month;
                queryString += ", " + item.item_year;
                queryString += ", '" + item.item_img_src;
                queryString += "', " + item.item_amount;
                queryString += ", '" + item.item_name;
                queryString += "', " + item.item_sort_sequence + "), ";

            }
            var lastItem = req.body[req.body.length - 1];
            queryString += "(" + req.budgetID;
            queryString += ", " + 1;
            queryString += ", " + lastItem.item_month;
            queryString += ", " + lastItem.item_year;
            queryString += ", '" + lastItem.item_img_src;
            queryString += "', " + lastItem.item_amount;
            queryString += ", '" + lastItem.item_name;
            queryString += "', " + lastItem.item_sort_sequence + ")";
            // make query
            client.query(queryString,
                function(err, result) {
                    if (err) {
                        //error
                        client.release();
                        console.log('Error Inserting flowitems', err);
                        res.sendStatus(500);
                    } else {
                        client.release();
                        res.sendStatus(201);
                    }
                });
        });
});

router.delete("/flowitems/:month", function(req, res) {
    var month = req.params.month;
    pool.connect()
        .then(function(client) {
            var queryString = 'DELETE FROM budget_flow_item WHERE budget_id = $1 AND item_month = $2';
            client.query(queryString, [req.budgetID, month], function(err, result) {
                if (err) {
                    client.release();
                    console.log('Error deleting flow items', err);
                    res.sendStatus(500);
                } else {
                    client.release();
                    res.send(result.rows);
                }
            });
        });
});

// *********************************** FLEX, FINANCIAL, and FUNCTIONAL ITEM routes **************************

// Route: GET items for a budget
router.get("/items/:categoryID", function(req, res) {
    var categoryID = req.params.categoryID;
    pool.connect()
        .then(function(client) {
            var queryString = 'SELECT category_name, budget_template_category_id, item_name, item_img_src, item_amount, item_sort_sequence ';
            queryString += 'FROM budget_template_category, budget_item ';
            queryString += 'WHERE budget_template_category.id = budget_item.budget_template_category_id ';
            queryString += 'AND budget_id = $1 ';
            queryString += 'AND budget_template_category_id = $2 ';
            queryString += 'ORDER BY item_sort_sequence';
            client.query(queryString, [req.budgetID, categoryID], function(err, result) {
                if (err) {
                    client.release();
                    console.log('Error getting budget items', err);
                    res.sendStatus(500);
                } else {
                    client.release();
                    res.send(result.rows);
                }
            });
        });
});

// Route: Insert budget items for a budget category
router.post("/items", function(req, res) {
    pool.connect()
        .then(function(client) {
            var queryString = 'INSERT INTO budget_item (budget_id, budget_template_category_id, item_img_src, item_name, item_amount, item_sort_sequence) VALUES ';
            if (req.body.length === 1) {
                var oneItem = req.body[req.body.length - 1];
                queryString += "(" + req.budgetID;
                queryString += ", " + oneItem.budget_template_category_id;
                queryString += ", '" + oneItem.item_img_src;
                queryString += "', '" + oneItem.item_name;
                queryString += "', " + oneItem.item_amount;
                queryString += ", " + oneItem.item_sort_sequence + ")";
            } else {
                for (var i = 0; i < req.body.length - 1; i++) {
                    var item = req.body[i];
                    queryString += "(" + req.budgetID;
                    queryString += ", " + item.budget_template_category_id;
                    queryString += ", '" + item.item_img_src;
                    queryString += "', '" + item.item_name;
                    queryString += "', " + item.item_amount;
                    queryString += ", " + item.item_sort_sequence + "),";
                }
                var lastItem = req.body[req.body.length - 1];
                queryString += "(" + req.budgetID;
                queryString += ", " + lastItem.budget_template_category_id;
                queryString += ", '" + lastItem.item_img_src;
                queryString += "', '" + lastItem.item_name;
                queryString += "', " + lastItem.item_amount;
                queryString += ", " + lastItem.item_sort_sequence + ")";
            }
            client.query(queryString,
                function(err, result) {
                    if (err) {
                        client.release();

                        console.log('Error Inserting budget items', err);
                        res.sendStatus(500);
                    } else {
                        client.release();

                        res.sendStatus(201);
                    }
                }
            );
        });
});

// Route: Delete budget items for a budget
router.delete("/items/:categoryID", function(req, res) {
    var categoryID = req.params.categoryID;
    pool.connect()
        .then(function(client) {
            var queryString = 'DELETE FROM budget_item WHERE budget_id = $1 AND budget_template_category_id = $2';
            client.query(queryString, [req.budgetID, categoryID], function(err, result) {
                if (err) {
                    client.release();
                    console.log('Error deleting budget items', err);
                    res.sendStatus(500);
                } else {
                    client.release();
                    res.send(result.rows);
                }
            });
        });
});

// *********************************** Comment routes ************************** //
// Route: Get comment items for a budget
router.get("/comments", function(req, res) {

    pool.connect()
        .then(function(client) {
            var queryString = 'SELECT budget_comment, id, created_at FROM budget_comment WHERE budget_id = $1';
            client.query(queryString, [req.budgetID])
                .then(function(result) {
                    client.release();
                    res.send(result.rows);
                }).catch(function(err) {
                    // error
                    client.release();
                    console.log('Error on get comment', err);
                    res.sendStatus(500);
                }); // end inner then
        }); // end first then
}); // end route.get

router.post("/comments", function(req, res) {
    pool.connect()
        .then(function(client) {
            client.query('INSERT INTO budget_comment (budget_id, budget_comment) VALUES($1, $2)', [req.budgetID, req.body.budget_comment], (err, result) => {
                if (err) {
                    client.release();
                    console.log('Error Inserting comment', err);
                    res.sendStatus(500);
                } else {
                    client.release();
                    res.sendStatus(201);
                }
            });
        });
}); // end route.post

module.exports = router;
