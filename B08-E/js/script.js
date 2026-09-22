// Provided above the marker
const playlist = document.getElementById('playlist');
const favCount = document.getElementById('favCount');
const STORAGE_KEY = 'roadTripMix.favourites';

/* ===================== WORK BELOW THIS MARKER ===================== */

function getFavouriteIds() {
  return [...playlist.querySelectorAll('.track--fav')].map(li => li.dataset.id);
}

function updateCount() {
  favCount.textContent = playlist.querySelectorAll('.track--fav').length;
}

function saveFavourites() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(getFavouriteIds()));
}

function restoreFavourites() {
  const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
  saved.forEach(id => {
    const li = playlist.querySelector(`.track[data-id="${id}"]`);
    if (li) li.classList.add('track--fav');
  });
  updateCount();
}

playlist.addEventListener('click', (e) => {
  const btn = e.target.closest('.fav');
  if (!btn) return;
  const li = btn.closest('.track');
  li.classList.toggle('track--fav');
  updateCount();
  saveFavourites();
});

restoreFavourites();
