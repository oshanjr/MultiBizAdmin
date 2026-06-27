const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  connectionString: "postgresql://postgres.nnhtayiqztuxxwvikjot:nP5nfbzcagcagGur@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres",
});

async function main() {
  try {
    await client.connect();
    const hash = await bcrypt.hash("admin123", 10);
    const res = await client.query('UPDATE "User" SET "passwordHash" = $1 WHERE email = $2 RETURNING id, email', [hash, 'oshanjr@admin.com']);
    console.log("Updated rows:", res.rowCount);
    console.log("Updated user:", res.rows[0]);
  } catch (err) {
    console.error("Error resetting password:", err);
  } finally {
    await client.end();
  }
}

main();
