var config = {
  user: process.env.DATA_BASE_USER,
  database: process.env.DATA_BASE,
  password: process.env.DATA_BASE_PASSWORD, //env var: PGPASSWORD
  host: process.env.DATA_BASE_HOST, // Server hosting the postgres database
  ssl: true,
  // port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

module.exports = config;



// var config = {
//   user: "ggsnfqqetabdkl",
//   database: "d993oqov983da6",
//   password: "513e528808035aadbce8b45677d6fb4bfa5bd65387a15b1ac398c3171ea6b6a9", 
//   host: "ec2-54-225-66-44.compute-1.amazonaws.com", // Server hosting the postgres database
//   ssl: true,
//   max: 10, // max number of clients in the pool
//   idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
// };

// module.exports = config;