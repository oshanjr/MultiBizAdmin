const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres.nnhtayiqztuxxwvikjot:nP5nfbzcagcagGur@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres",
});

async function main() {
  try {
    await client.connect();
    const res = await client.query('SELECT id, name, email, role, "passwordHash" FROM "User"');
    console.log("USERS IN DATABASE:");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error("Error querying db:", err);
  } finally {
    await client.end();
  }
}

main();
