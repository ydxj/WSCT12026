// --- Provided constants ---
const SCENE_W = 600, SCENE_H = 400;
const PIECE_SIZE = 60;
const HOLE_Y = 100;
const TOLERANCE = 5;
const IMAGES = ['assets/1.svg', 'assets/2.svg', 'assets/3.svg', 'assets/4.svg', 'assets/5.svg'];

const scene = document.getElementById('scene');
const hole = document.getElementById('hole');
const piece = document.getElementById('piece');
const handle = document.getElementById('handle');
const track = document.querySelector('.track');
const status = document.getElementById('status');

const MAX_X = SCENE_W - PIECE_SIZE; // rightmost valid piece/hole x (hole stays fully inside)

let targetX = 0;
let currentImage = '';
let solved = false;

function randomTargetX() {
  // at least 100px from the left edge, hole must stay fully inside the scene
  return Math.round(100 + Math.random() * (MAX_X - 100));
}

function newChallenge() {
  solved = false;
  scene.classList.remove('solved');
  status.textContent = 'Slide to fit the piece into the gap';
  status.classList.remove('success');

  currentImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  targetX = randomTargetX();

  scene.style.backgroundImage = `url('${currentImage}')`;

  hole.style.left = targetX + 'px';

  piece.style.backgroundImage = `url('${currentImage}')`;
  piece.style.backgroundPosition = `-${targetX}px -${HOLE_Y}px`;
  setPieceX(0);
  setHandleFromPieceX(0);
}

function setPieceX(x) {
  x = Math.max(0, Math.min(MAX_X, x));
  piece.style.left = x + 'px';
  piece.dataset.x = x;
  return x;
}

function setHandleFromPieceX(x) {
  const trackRange = track.clientWidth - handle.clientWidth;
  const frac = x / MAX_X;
  handle.style.left = (frac * trackRange) + 'px';
}

// --- Pointer-driven horizontal-only slider ---
let dragging = false;
let startPointerX = 0;
let startPieceX = 0;

handle.addEventListener('pointerdown', (e) => {
  if (solved) return;
  dragging = true;
  startPointerX = e.clientX;
  startPieceX = parseFloat(piece.dataset.x || 0);
  handle.setPointerCapture(e.pointerId);
});

handle.addEventListener('pointermove', (e) => {
  if (!dragging || solved) return;
  const trackRange = track.clientWidth - handle.clientWidth;
  const deltaPointer = e.clientX - startPointerX;
  // proportion of the handle's travel maps to the piece's travel range
  const deltaPiece = deltaPointer * (MAX_X / trackRange);
  const newX = setPieceX(startPieceX + deltaPiece);
  setHandleFromPieceX(newX);
});

function endDrag(e) {
  if (!dragging) return;
  dragging = false;
  handle.releasePointerCapture(e.pointerId);
  checkTolerance();
}

handle.addEventListener('pointerup', endDrag);
handle.addEventListener('pointercancel', endDrag);

function checkTolerance() {
  const x = parseFloat(piece.dataset.x || 0);
  if (Math.abs(x - targetX) <= TOLERANCE) {
    setPieceX(targetX);
    setHandleFromPieceX(targetX);
    solved = true;
    scene.classList.add('solved');
    status.textContent = 'Success! Loading a new challenge…';
    status.classList.add('success');
    setTimeout(newChallenge, 1500);
  }
  // otherwise: leave the piece where it was released, user can keep dragging
}

newChallenge();
