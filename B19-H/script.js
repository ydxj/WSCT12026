const SCENE_W = 600;
const SCENE_H = 400;
const PIECE_SIZE = 60;
const HOLE_Y = 100;
const TOLERANCE = 5;

const IMAGES = [
  'assets/1.svg',
  'assets/2.svg',
  'assets/3.svg',
  'assets/4.svg',
  'assets/5.svg'
];

const scene = document.getElementById('scene');
const hole = document.getElementById('hole');
const piece = document.getElementById('piece');
const handle = document.getElementById('handle');
const track = document.querySelector('.track');
const status = document.getElementById('status');

const MAX_X = SCENE_W - PIECE_SIZE;

let targetX;
let pieceX = 0;
let dragging = false;
let startPointerX;
let startPieceX;
let solved = false;

// Pick a random position for the hole
function randomTargetX() {
  return Math.floor(100 + Math.random() * (MAX_X - 100 + 1));
}

// Move the piece and handle together
function movePiece(x) {
  pieceX = Math.max(0, Math.min(MAX_X, x));

  piece.style.left = `${pieceX}px`;

  const handleRange = track.clientWidth - handle.clientWidth;
  const handleX = (pieceX / MAX_X) * handleRange;

  handle.style.left = `${handleX}px`;
}

// Start a new CAPTCHA
function newChallenge() {
  solved = false;

  scene.classList.remove('solved');
  status.classList.remove('success');
  status.textContent = 'Slide to fit the piece into the gap';

  // Random image
  const image = IMAGES[Math.floor(Math.random() * IMAGES.length)];

  // Random hole position
  targetX = randomTargetX();

  // Background image
  scene.style.backgroundImage = `url("${image}")`;

  // Hole
  hole.style.left = `${targetX}px`;
  hole.style.top = `${HOLE_Y}px`;

  // Piece uses the same image, showing the part inside the hole
  piece.style.backgroundImage = `url("${image}")`;
  piece.style.backgroundPosition = `-${targetX}px -${HOLE_Y}px`;

  // Reset piece and slider
  movePiece(0);
}

// Start dragging
handle.addEventListener('pointerdown', (e) => {
  if (solved) return;

  dragging = true;
  startPointerX = e.clientX;
  startPieceX = pieceX;

  handle.setPointerCapture(e.pointerId);
});

// Move horizontally
handle.addEventListener('pointermove', (e) => {
  if (!dragging || solved) return;

  const handleRange = track.clientWidth - handle.clientWidth;

  // Convert handle movement into piece movement
  const pointerMove = e.clientX - startPointerX;
  const pieceMove = pointerMove * (MAX_X / handleRange);

  movePiece(startPieceX + pieceMove);
});

// Finish dragging
function stopDragging(e) {
  if (!dragging) return;

  dragging = false;

  if (handle.hasPointerCapture(e.pointerId)) {
    handle.releasePointerCapture(e.pointerId);
  }

  // Check whether the piece is close enough
  if (Math.abs(pieceX - targetX) <= TOLERANCE) {
    movePiece(targetX);

    solved = true;
    scene.classList.add('solved');

    status.textContent = 'Success! Loading a new challenge…';
    status.classList.add('success');

    setTimeout(newChallenge, 1500);
  }
}

handle.addEventListener('pointerup', stopDragging);
handle.addEventListener('pointercancel', stopDragging);

// First challenge
newChallenge();