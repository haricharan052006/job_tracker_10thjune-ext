const { Pool } = require('pg');

const prefixes = ['aws-0', 'aws-1'];
const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-southeast-2',
  'ca-central-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'sa-east-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2'
];

async function run() {
  for (const p of prefixes) {
    for (const r of regions) {
      const host = `${p}-${r}.pooler.supabase.com`;
      const url = `postgresql://postgres.oqgktcryvqvgkwnjtefb:Hari%40052006charan@${host}:6543/postgres?sslmode=no-verify`;
      const pool = new Pool({
        connectionString: url,
        connectionTimeoutMillis: 2000
      });
      try {
        const res = await pool.query('SELECT 1');
        console.log(`Prefix: ${p}, Region ${r}: SUCCESS!`);
        break;
      } catch (err) {
        if (!err.message.includes('ENOTFOUND')) {
          console.log(`Prefix: ${p}, Region ${r}: ${err.message}`);
        }
      } finally {
        await pool.end();
      }
    }
  }
}

run();
