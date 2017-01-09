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
        client.query('SELECT * FROM budget_item', function(err, result) {
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








// var express = require('express');
// var router = express.Router();
// var pg = require('pg');
// var config = require('../modules/database-config');
//
// var pool = new pg.Pool({
//     database: config.database
// });
//
// router.get('/category', function(req, res) {
//     console.log('1');
//     pool.connect()
//         .then(function(client) {
//                 client.query(
//                         'select * from budget_category')
//                     .then(function(result) {
//                         client.release();
//                         console.log('result:', result.rows);
//                         res.send(result.rows);
//                     })
//                     .catch(function(err) {
//                         // error
//                         client.release();
//                         console.log('error on SELECT', err);
//                         res.sendStatus(500);
//                     });
//         });
// });
//
//
// // router.get("/category", function(req, res) {
// //     pg.connect(connectionString, function(err, client, done) {
// //       console.log(client);
// //         client.query('SELECT * FROM budget_category'), function(err, result) {
// //               console.log('result', result);
// //                 done();
// //                 if (err) {
// //                     console.log('Error getting categories', err);
// //                     res.sendStatus(500);
// //                 } else {
// //                     console.log('Categories returned:', result);
// //                     res.send(result);
// //                 }
// //             }
// //     });
// // });
//
// module.exports = router;
