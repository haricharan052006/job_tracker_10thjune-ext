const { Pool } = require('pg');

const host = "aws-1-ap-northeast-1.pooler.supabase.com";
const password = "Hari%40052006charan";

const tests = [
  {
    name: "Dotted username on port 5432",
    url: `postgresql://postgres.oqgktcryvqvgkwnjtefb:${password}@${host}:5432/postgres?sslmode=no-verify`
  },
  {
    name: "Dotted username on port 6543",
    url: `postgresql://postgres.oqgktcryvqvgkwnjtefb:${password}@${host}:6543/postgres?sslmode=no-verify`
  },
  {
    name: "No-dot username + options=reference on port 5432",
    url: `postgresql://postgres:${password}@${host}:5432/postgres?sslmode=no-verify&options=reference%3Doqgktcryvqvgkwnjtefb`
  },
  {
    name: "No-dot username + options=reference on port 6543",
    url: `postgresql://postgres:${password}@${host}:6543/postgres?sslmode=no-verify&options=reference%3Doqgktcryvqvgkwnjtefb`
  },
  {
    name: "No-dot username + options=project on port 5432",
    url: `postgresql://postgres:${password}@${host}:5432/postgres?sslmode=no-verify&options=project%3Doqgktcryvqvgkwnjtefb`
  },
  {
    name: "No-dot username + options=project on port 6543",
    url: `postgresql://postgres:${password}@${host}:6543/postgres?sslmode=no-verify&options=project%3Doqgktcryvqvgkwnjtefb`
  }
];

async function run() {
  for (const t of tests) {
    console.log(`\n--- Testing: ${t.name} ---`);
    const pool = new Pool({
      connectionString: t.url,
      connectionTimeoutMillis: 5000
    });
    try {
      const res = await pool.query('SELECT 1');
      console.log("SUCCESS:", res.rows);
    } catch (err) {
      console.error("ERROR:", err.message);
    } finally {
      await pool.end();
    }
  }
}

run();
