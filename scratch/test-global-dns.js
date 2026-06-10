const dns = require('dns');

const targetIp = "57.182.231.186"; // Tokyo pooler IPv4
const host = "db.oqgktcryvqvgkwnjtefb.supabase.co";

// Override dns.lookup globally
const originalLookup = dns.lookup;
dns.lookup = function(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  if (hostname === host) {
    console.log(`[GLOBAL DNS] Intercepted lookup for ${hostname} -> resolving to ${targetIp}`);
    return callback(null, targetIp, 4);
  }
  return originalLookup.call(dns, hostname, options, callback);
};

// Now require pg and try to connect
const { Pool } = require('pg');
const password = "Hari%40052006charan";
const url = `postgresql://postgres:${password}@${host}:5432/postgres?sslmode=require`;

console.log("Connecting with global DNS override...");
const pool = new Pool({
  connectionString: url,
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
