var poolConfig = {
  user: process.env.DATA_BASE_USER,
  database: process.env.DATA_BASE,
  password: process.env.DATA_BASE_PASSWORD, //env var: PGPASSWORD
  host: process.env.DATA_BASE_HOST, // Server hosting the postgres database
  ssl: true,
  // port: 5432,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

module.exports = {
  pg: poolConfig
};