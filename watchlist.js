import { key } from './apikey.js';
import { getMediaFromId } from './index.js';

const baseUrlId = `https://unique-kringle-436728.netlify.app/api/?apikey=${key}&i=`;
const mainContainer = document.getElementById('main-container');
let watchlistArr = [];
let detailedWatchlist = [];

function loadWatchlist() {
  mainContainer.innerHTML = '';
  watchlistArr = JSON.parse(localStorage.getItem('watchlist'));
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
            <img src="/asset/add-icon.png" data-imdb-id="${media.imdbID}" class="media-detail__watchlist-btn"/>
            <p>Watchlist</p>
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
}

loadWatchlist();
