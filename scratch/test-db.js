const { Pool } = require('pg');

const connectionString = "postgresql://postgres:Hari%40052006charan@db.oqgktcryvqvgkwnjtefb.supabase.co:5432/postgres?sslmode=no-verify";

console.log("Connecting with 5432...");
const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 5000
});

pool.query('SELECT 1', (err, res) => {
  if (err) {
    console.error("Error on 5432:", err.message);
  } else {
    console.log("Success on 5432:", res.rows);
  }
  pool.end();

  // Try 6543
  const connectionString6543 = "postgresql://postgres:Hari%40052006charan@db.oqgktcryvqvgkwnjtefb.supabase.co:6543/postgres?sslmode=no-verify";
  console.log("Connecting with 6543...");
  const pool6543 = new Pool({
    connectionString: connectionString6543,
    connectionTimeoutMillis: 5000
  });
  pool6543.query('SELECT 1', (err2, res2) => {
    if (err2) {
      console.error("Error on 6543:", err2.message);
    } else {
      console.log("Success on 6543:", res2.rows);
    }
    pool6543.end();
  });
});
