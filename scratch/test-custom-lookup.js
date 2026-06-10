const { Pool } = require('pg');

const targetIp = "57.182.231.186"; // Tokyo pooler IPv4
const host = "db.oqgktcryvqvgkwnjtefb.supabase.co";
const password = "Hari%40052006charan";

// Custom lookup function that intercepts host resolution
const customLookup = (hostname, options, callback) => {
  if (hostname === host) {
    console.log(`Intercepted lookup for ${hostname} -> resolving to ${targetIp}`);
    callback(null, targetIp, 4); // resolve to IPv4 targetIp
  } else {
    require('dns').lookup(hostname, options, callback);
  }
};

const url = `postgresql://postgres:${password}@${host}:5432/postgres?sslmode=require`;

console.log("Connecting with custom lookup...");
const pool = new Pool({
  connectionString: url,
  lookup: customLookup,
  connectionTimeoutMillis: 5000
});

pool.query('SELECT 1', (err, res) => {
  if (err) {
    console.error("ERROR:", err.message);
  } else {
    console.log("SUCCESS:", res.rows);
  }
  pool.end();
});
