// C09-M: Room Booking Conflict Checker
// Plain Node.js http server, no frameworks/dependencies.
// GET  /rooms
// GET  /bookings
// POST /book   { room_id, date: "YYYY-MM-DD", start: "HH:MM", end: "HH:MM", attendees }
// Run: node server.js  -> http://localhost:4001

const http = require('http');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const roomsPath = path.join(dataDir, 'rooms.json');
const bookingsPath = path.join(dataDir, 'bookings.json');

function loadRooms() { return JSON.parse(fs.readFileSync(roomsPath, 'utf8')); }
function loadBookings() { return JSON.parse(fs.readFileSync(bookingsPath, 'utf8')); }
function saveBookings(bookings) {
  fs.writeFileSync(bookingsPath, JSON.stringify(bookings, null, 2));
}

function sendJSON(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(json);
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

const OPEN = toMinutes('08:00');
const CLOSE = toMinutes('20:00');

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/rooms') {
    return sendJSON(res, 200, { data: loadRooms() });
  }

  if (req.method === 'GET' && req.url === '/bookings') {
    return sendJSON(res, 200, { data: loadBookings() });
  }

  if (req.method === 'POST' && req.url === '/book') {
    let body;
    try { body = await readBody(req); }
    catch { return sendJSON(res, 400, { error: 'Invalid JSON body' }); }

    const { room_id, date, start, end, attendees } = body;

    // 1. Room exists
    const rooms = loadRooms();
    const room = rooms.find(r => r.id === room_id);
    if (!room) return sendJSON(res, 404, { error: 'Room not found' });

    // 2. Capacity
    if (
      typeof attendees !== 'number' ||
      attendees < 1 ||
      attendees > room.capacity
    ) {
      return sendJSON(res, 422, { error: 'Room capacity exceeded' });
    }

    // 3. Opening hours
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    if (startMin < OPEN || endMin > CLOSE) {
      return sendJSON(res, 422, { error: 'Outside opening hours' });
    }

    // 4. Time range
    if (!(endMin > startMin)) {
      return sendJSON(res, 422, { error: 'Invalid time range' });
    }

    // 5. No overlap (touching slots are allowed)
    const bookings = loadBookings();
    const clash = bookings.find(b => {
      if (b.room_id !== room_id || b.date !== date) return false;
      const bStart = toMinutes(b.start);
      const bEnd = toMinutes(b.end);
      return startMin < bEnd && endMin > bStart; // strict overlap only
    });
    if (clash) {
      return sendJSON(res, 409, { error: `Time slot conflicts with booking ${clash.id}` });
    }

    // 6. Success
    const newId = bookings.reduce((max, b) => Math.max(max, b.id), 0) + 1;
    const booking = { id: newId, room_id, date, start, end, attendees };
    bookings.push(booking);
    saveBookings(bookings);
    return sendJSON(res, 201, { data: { booking } });
  }

  sendJSON(res, 404, { error: 'Not found' });
});

server.listen(4001, () => console.log('C09-M server running at http://localhost:4001'));
