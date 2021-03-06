// get pool class from pg

const { Pool } = require("pg");

// create instance from pool class

const pool = new Pool();

module.exports = {
  // query with pool on postgres
  async query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("executed query", { text, duration, rows: res.rowCount });
    return res;
  },
};
