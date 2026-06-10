const { Pool } = require('pg');

const tests = [
  {
    name: "Standard dotted username on Tokyo pooler (port 6543)",
    url: "postgresql://postgres.oqgktcryvqvgkwnjtefb:Hari%40052006charan@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=no-verify"
  },
  {
    name: "Standard dotted username on Tokyo pooler (port 5432)",
    url: "postgresql://postgres.oqgktcryvqvgkwnjtefb:Hari%40052006charan@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=no-verify"
  },
  {
    name: "Username postgres with options=reference=oqgktcryvqvgkwnjtefb (port 6543)",
    url: "postgresql://postgres:Hari%40052006charan@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=no-verify&options=reference%3Doqgktcryvqvgkwnjtefb"
  },
  {
    name: "Username postgres with options=reference=oqgktcryvqvgkwnjtefb (port 5432)",
    url: "postgresql://postgres:Hari%40052006charan@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=no-verify&options=reference%3Doqgktcryvqvgkwnjtefb"
  },
  {
    name: "Username postgres with options=project=oqgktcryvqvgkwnjtefb (port 5432)",
    url: "postgresql://postgres:Hari%40052006charan@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=no-verify&options=project%3Doqgktcryvqvgkwnjtefb"
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
