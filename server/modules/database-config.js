var pg = require('pg');

pg.defaults.ssl = true;

var herokuDB = 
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT * FROM budget;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});


module.exports = herokuDB;
