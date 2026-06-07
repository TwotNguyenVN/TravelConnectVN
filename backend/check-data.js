const { Client } = require('pg');
require('dotenv').config();

async function check() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL
  });

  try {
    await client.connect();
    const res = await client.query('SELECT COUNT(*) FROM tours');
    console.log("Number of tours:", res.rows[0].count);
    
    const settings = await client.query('SELECT * FROM system_settings');
    console.log("System settings:", settings.rows);
  } catch (err) {
    console.error("Error connecting to DB:", err.message);
  } finally {
    await client.end();
  }
}

check();
