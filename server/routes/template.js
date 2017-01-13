var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

router.get("/category", function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        client.query('SELECT * FROM budget_category', function(err, result) {
            done();
            if (err) {
                console.log('Error COMPLETING category select task', err);
                res.sendStatus(500);
            } else {
                res.send(result.rows);
                console.log('retrieved categories');
            }
        });
    });
});

router.get("/item", function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
      var queryString = 'SELECT budget_category.category_name, budget_item.item_name, ';
      queryString += 'budget_item.item_text, budget_item.item_placeholder_text, budget_item.item_img_src, ';
      queryString += 'budget_item.item_sort_sequence FROM budget_category, budget_item ';
      queryString += 'WHERE budget_category.id = budget_item.budget_category_id ';
      queryString += 'ORDER BY category_name, item_sort_sequence';
      // console.log(queryString);
        client.query(queryString,
            function(err, result) {
                done();
                if (err) {
                    console.log('Error COMPLETING item select task', err);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                    console.log('retrieved items');
                }
            });
    });
});

module.exports = router;
