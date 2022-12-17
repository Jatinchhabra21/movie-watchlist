import { key } from '/apikey.js';

const searchBox = document.getElementById('search-box');
const baseUrlSearch = `http://www.omdbapi.com/?apikey=${key}&s=`;
const baseUrlId = `http://www.omdbapi.com/?apikey=${key}&i=`;
const mainContainer = document.getElementById('main-container');
let searchResultHtml = '';
let watchlistArr = [];

document.addEventListener('click', handleClickEvent);

function handleClickEvent(event) {
  if (event.target.id === 'search-btn') {
    mainContainer.innerHTML = '';
    searchMedia();
  } else if (event.target.className === 'media-detail__watchlist-btn') {
    watchlistArr.push(event.target.dataset.imdbId);
    if (localStorage.watchlist) {
      const localStorageWatchlist = JSON.parse(
        localStorage.getItem('watchlist')
      );
      let updatedWatchlist = [...localStorageWatchlist, ...watchlistArr];
      updatedWatchlist = JSON.stringify(
        updatedWatchlist.filter(
          (id, pos) => updatedWatchlist.indexOf(id) === pos
        )
      );
      localStorage.setItem('watchlist', updatedWatchlist);
    } else {
      localStorage.setItem('watchlist', JSON.stringify(watchlistArr));
    }
  }
}

async function searchMedia() {
  if (searchBox.value) {
    const data = await getMediaFromSearch(baseUrlSearch + searchBox.value);
    !data.Error ? decorateSearchResult(data.Search) : noMovieFound(data.Error);
  } else {
    mainContainer.innerHTML += `<p style="color: red">Please enter a valid search query</p>`;
  }
}

function getMediaFromSearch(queryUrl) {
  const data = fetch(queryUrl).then((response) => response.json());
  return data;
}

function getMediaFromId(queryUrl) {
  const data = fetch(queryUrl).then((response) => response.json());
  return data;
}

function noMovieFound(errorMsg) {
  mainContainer.innerHTML = `<p style="color: red">${errorMsg}</p>`;
}

async function getMediaDetail(media) {
  const mediaDetail = await getMediaFromId(baseUrlId + media.imdbID);
  if (media.Poster !== 'N/A' && mediaDetail.Plot !== 'N/A') {
    mainContainer.innerHTML += `
    <div class="search-result">
      <img src="${media.Poster}" class="media-detail__poster"/>
      <div class="media-detail">
        <div class="media-detail__header">
          <h4>${media.Title}</h4>
          <p class="media-detail__rating"><img src="asset/star.png" /> ${mediaDetail.imdbRating}</p>
        </div>
        <div class="media-detail__sub-header">
          <p class="media-detail__run-time">${mediaDetail.Runtime}</p>
          <p class="media-detail__genre">${mediaDetail.Genre}</p>
          <span class="media-detail__watchlist">
            <img src="/asset/add-icon.png" data-imdb-id="${mediaDetail.imdbID}" class="media-detail__watchlist-btn"/>
            <p>Watchlist</p>
          </span>
        </div>
        <div class="media-detail__plot">
          <p>
           ${mediaDetail.Plot}
          </p>
        </div>
      </div>
    </div>`;
  }
  return searchResultHtml;
}

function decorateSearchResult(data) {
  data.forEach(getMediaDetail);
}

export { getMediaFromId };
