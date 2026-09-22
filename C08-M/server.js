// C08-M: Job Search & Pagination
// Plain Node.js http server, no frameworks/dependencies.
// GET /jobs                -> all jobs, unfiltered/unpaginated (starter behaviour kept)
// GET /jobs?search=&page=  -> filtered + paginated, with a meta block
// Run: node server.js  -> http://localhost:4000

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const jobs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'jobs.json'), 'utf8'));

const PER_PAGE = 10;

function sendJSON(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(json);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/jobs') {
    const search = (url.searchParams.get('search') || '').trim().toLowerCase();
    let page = parseInt(url.searchParams.get('page'), 10);
    if (!Number.isInteger(page) || page < 1) page = 1;

    const filtered = search
      ? jobs.filter(j =>
          j.title.toLowerCase().includes(search) ||
          j.company.toLowerCase().includes(search))
      : jobs;

    const total = filtered.length;
    const total_pages = Math.max(1, Math.ceil(total / PER_PAGE));
    const start = (page - 1) * PER_PAGE;
    const pageItems = filtered.slice(start, start + PER_PAGE);

    return sendJSON(res, 200, {
      data: pageItems,
      meta: { total, page, per_page: PER_PAGE, total_pages },
    });
  }

  sendJSON(res, 404, { error: 'Not found' });
});

server.listen(4000, () => console.log('C08-M server running at http://localhost:4000'));
