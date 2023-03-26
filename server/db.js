const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.DATA_BASE_USER,
  password: "",
  host: process.env.DATA_BASE_HOST,
  port: process.env.DATA_BASE_PORT,
  database: process.env.DATA_BASE_NAME,
});

module.exports = pool;
