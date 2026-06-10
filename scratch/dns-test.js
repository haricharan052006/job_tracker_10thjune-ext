const dns = require('dns');

dns.resolve6('db.oqgktcryvqvgkwnjtefb.supabase.co', (err, addresses) => {
  console.log('resolve6 db:', err, addresses);
});

dns.resolveAny('db.oqgktcryvqvgkwnjtefb.supabase.co', (err, addresses) => {
  console.log('resolveAny db:', err, addresses);
});

dns.resolveAny('oqgktcryvqvgkwnjtefb.supabase.co', (err, addresses) => {
  console.log('resolveAny api:', err, addresses);
});
