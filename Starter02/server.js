// Starter Task 02: Back-end Skeleton
// Plain Node.js (no frameworks). Run: node server.js  -> http://localhost:3000
const http = require('http');
const os = require('os');

const server = http.createServer((req, res) => {
  const now = new Date();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Starter 02 - Server Info</title>
  <style>
    body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;
         display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}
    .card{background:#1e293b;padding:2rem 3rem;border-radius:12px;}
    h1{margin-top:0;font-size:1.4rem;}
    table{border-collapse:collapse;}
    td{padding:4px 12px;font-family:monospace;}
    td:first-child{color:#94a3b8;}
  </style>
</head>
<body>
  <div class="card">
    <h1>Server-side rendered info</h1>
    <table>
      <tr><td>Server time</td><td>${now.toISOString()} (${now.toString()})</td></tr>
      <tr><td>Hostname</td><td>${os.hostname()}</td></tr>
      <tr><td>Platform</td><td>${os.platform()} ${os.release()}</td></tr>
      <tr><td>Node version</td><td>${process.version}</td></tr>
      <tr><td>Uptime</td><td>${process.uptime().toFixed(1)}s</td></tr>
      <tr><td>Request URL</td><td>${req.url}</td></tr>
    </table>
  </div>
</body>
</html>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(3000, () => console.log('Starter02 server running at http://localhost:3000'));
