const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  connectionString: "postgresql://postgres.nnhtayiqztuxxwvikjot:nP5nfbzcagcagGur@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres",
});

async function main() {
  await client.connect();
  const res = await client.query('SELECT * FROM "User" WHERE email = $1', ['oshanjr@admin.com']);
  const user = res.rows[0];
  console.log("User found:", user.email);
  
  const passwordsMatch = await bcrypt.compare("admin123", user.passwordHash);
  console.log("Passwords match:", passwordsMatch);
  
  await client.end();
}
main().catch(console.error);
