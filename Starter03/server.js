// Starter Task 03: Back-end with Database
// Reads data/records.json, ensures a MySQL table exists, inserts the rows
// (idempotently), then renders them as an HTML table.
//
// IMPORTANT: replace data/records.json with the ACTUAL records supplied in
// your competition's media asset folder — this file only ships a placeholder
// sample so the project runs out of the box.
//
// Setup:
//   npm install
//   set env vars (or edit the defaults below): DB_HOST, DB_USER, DB_PASS, DB_NAME
//   node server.js  ->  http://localhost:3001

const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'starter03',
};

const records = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'records.json'), 'utf8')
);

async function getConnection() {
  // Connect without a database first so we can CREATE DATABASE IF NOT EXISTS.
  const bootstrap = await mysql.createConnection({
    host: DB_CONFIG.host, user: DB_CONFIG.user, password: DB_CONFIG.password,
  });
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\``);
  await bootstrap.end();
  return mysql.createConnection(DB_CONFIG);
}

async function seed(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS records (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      price DECIMAL(10,2),
      stock INT
    )
  `);
  for (const r of records) {
    await conn.query(
      `INSERT INTO records (id, name, category, price, stock) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name=VALUES(name), category=VALUES(category),
         price=VALUES(price), stock=VALUES(stock)`,
      [r.id, r.name, r.category, r.price, r.stock]
    );
  }
}

function renderTable(rows) {
  const headers = rows.length ? Object.keys(rows[0]) : [];
  const thead = headers.map(h => `<th>${h}</th>`).join('');
  const tbody = rows.map(r =>
    `<tr>${headers.map(h => `<td>${r[h]}</td>`).join('')}</tr>`
  ).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Starter 03 - DB Records</title>
<style>
  body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;padding:2rem;}
  table{border-collapse:collapse;width:100%;max-width:700px;margin:auto;}
  th,td{border:1px solid #334155;padding:8px 12px;text-align:left;}
  th{background:#1e293b;}
  h1{text-align:center;}
</style></head>
<body>
  <h1>Records loaded from MySQL</h1>
  <table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
  try {
    const conn = await getConnection();
    await seed(conn);
    const [rows] = await conn.query('SELECT * FROM records ORDER BY id');
    await conn.end();
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderTable(rows));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('DB error: ' + err.message +
      '\n\nMake sure MySQL is running and DB_HOST/DB_USER/DB_PASS env vars are set.');
  }
});

server.listen(3001, () => console.log('Starter03 server running at http://localhost:3001'));
