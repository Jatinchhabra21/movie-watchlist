import { key } from './apikey.js';
import { getMediaFromId } from './index.js';

const baseUrlId = `https://unique-kringle-436728.netlify.app/api/?apikey=${key}&i=`;
const mainContainer = document.getElementById('main-container');
let watchlistArr = [];

document.addEventListener('click', handleClickEvent);

function handleClickEvent(event) {
  if (event.target.className === 'media-detail__remove-btn') {
    removeFromWatchlist(event);
  }
}

function loadWatchlist() {
  mainContainer.innerHTML = '';
  watchlistArr = JSON.parse(localStorage.getItem('watchlist'));
  if (watchlistArr.length) {
    watchlistArr.forEach(async (imdbId) => {
      const media = await getMediaFromId(baseUrlId + imdbId);
      mainContainer.innerHTML += `
      <div class="search-result">
        <img src="${media.Poster}" class="media-detail__poster"/>
        <div class="media-detail">
          <div class="media-detail__header">
            <h4>${media.Title}</h4>
            <p class="media-detail__rating"><img src="asset/star.png" /> ${media.imdbRating}</p>
          </div>
          <div class="media-detail__sub-header">
            <p class="media-detail__run-time">${media.Runtime}</p>
            <p class="media-detail__genre">${media.Genre}</p>
            <span class="media-detail__watchlist">
              <img src="/asset/minus-icon.png" data-imdb-id="${media.imdbID}" class="media-detail__remove-btn"/>
              <p>Remove</p>
            </span>
          </div>
          <div class="media-detail__plot">
            <p>
             ${media.Plot}
            </p>
          </div>
        </div>
      </div>`;
    });
  } else {
    mainContainer.innerHTML = `
      <p class="no-media-msg">Your watchlist is looking a little empty...</p>
      <span class="add-media-container">
        <a href="./index.html"><img src="./asset/add-icon.png" style="width: 16px"></a>
        <p class="add-media-to-watchlist">Let’s add some movies!</p>
      </span>
    `;
  }
}

function removeFromWatchlist(event) {
  const imdbId = event.target.dataset.imdbId;
  watchlistArr = JSON.parse(localStorage.getItem('watchlist'));
  watchlistArr = Array.from(watchlistArr.filter((id) => id !== imdbId));
  localStorage.setItem('watchlist', JSON.stringify(watchlistArr));
  loadWatchlist();
}

loadWatchlist();
