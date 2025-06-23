// db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // se vuoi puoi aggiungere opzioni SSL o altro qui
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
