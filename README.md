# WSC2026 TP17 — Module A: Mini Projects (Web Technologies)

One folder per task, as required by the "Instructions to the Competitor"
section (one repo per task, named by task code).

## ⚠️ Placeholder images
The supplied PDF only contained text requirements — no `images/`, `assets/`
folders, or `example.mp4` reference videos were attached. Wherever a task
needed real photos (`A12-M`, `A23-E`, `B19-H`) I generated simple coloured
placeholder `.svg` files so every project runs immediately. Swap them for
the real competition assets and update the file extensions in the HTML/CSS
(`.svg` → `.jpg`) if your real files use JPGs.

Likewise `Starter03`'s `data/records.json` and `C06-M`'s `schema.sql` are
plausible stand-ins for the "media asset folder" data and the six-table
schema shown in the actual test project — replace them with the real files
when you have them; the SQL/JS logic itself doesn't need to change as long
as column names match.

## How to run each task

| Task | Type | Run |
|---|---|---|
| Starter01 | static HTML | open `Starter01/index.html` in a browser |
| Starter02 | Node http | `cd Starter02 && node server.js` → http://localhost:3000 |
| Starter03 | Node + MySQL | `cd Starter03 && npm install && node server.js` (needs a running MySQL; set `DB_HOST/DB_USER/DB_PASS`) → http://localhost:3001 |
| A07-M | static CSS | open `A07-M/index.html` |
| A12-M | static CSS | open `A12-M/index.html` |
| A23-E | static CSS | open `A23-E/index.html` |
| A25-E | static CSS | open `A25-E/index.html` |
| B08-E | static JS | open `B08-E/index.html` |
| B19-H | static JS | open `B19-H/index.html` |
| B30-E | static JS | open `B30-E/index.html` |
| B40-E | static JS | open `B40-E/index.html`, scroll with the mouse wheel |
| C06-M | SQL | `C06-M/query.sql` against the schema in `C06-M/schema.sql` |
| C08-M | Node http | `cd C08-M && node server.js` → http://localhost:4000/jobs |
| C09-M | Node http | `cd C09-M && node server.js` → POST http://localhost:4001/book |

## What was verified in this environment
- `C08-M` and `C09-M`: actually started and hit with `curl` — search, pagination,
  meta block, capacity/hours/overlap/touching-slot validation, 404/409/422/201
  status codes all confirmed correct.
- All `.js` files (standalone and inline `<script>` blocks): passed `node --check`.
- All `.html` files: passed basic tag-balance parsing.
- `Starter02` / `Starter03`: syntax-checked; `Starter03` needs a real MySQL
  instance to fully exercise (not available in this sandbox).
- The pure-CSS/visual tasks (`A07-M`, `A12-M`, `A23-E`, `A25-E`, `B30-E`, `B40-E`,
  `B19-H`'s drag interaction) were **not** rendered in an actual browser here —
  open them yourself and check against the reference videos mentioned in the
  spec, since subtle animation timing/easing can't be verified without a
  browser.
