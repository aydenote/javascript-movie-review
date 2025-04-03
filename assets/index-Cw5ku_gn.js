var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function Footer() {
  const $footer = document.createElement("footer");
  $footer.classList.add("footer");
  $footer.innerHTML = `<p>&copy; 우아한테크코스 All Rights Reserved.</p>
    <p><img src="images/woowacourse_logo.png" width="180" /></p>`;
  return $footer;
}
function getApiOptions(token) {
  const options = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  return options;
}
function getPopularParam(currentPage) {
  return {
    language: "ko-KR",
    page: currentPage
  };
}
function getSearchParam(inputValue, currentPage) {
  return {
    query: inputValue,
    page: currentPage,
    language: "ko-KR",
    include_adult: "false"
  };
}
function getDetailParam() {
  return {
    language: "ko-KR"
  };
}
function Button(text, className = "button", onClick) {
  const $button = document.createElement("button");
  $button.className = className;
  $button.innerText = text;
  $button.addEventListener("click", onClick);
  return $button;
}
function MovieDetailModal({ title, poster_path, release_date, vote_average, movieGenres, overview }, movieId) {
  const $modalBackground = document.createElement("div");
  const $modal = document.createElement("div");
  const $button = Button("", "close-modal");
  $modalBackground.className = "modal-background active";
  $modal.classList.add("modal");
  $button.innerHTML = `<img src="images/modal_button_close.png" />`;
  $button.id = "closeModal";
  const releaseYear = release_date.split("-")[0];
  const genresString = movieGenres.map((genre) => genre.name).join(", ");
  const defaultRating = 2;
  $modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-image">
        <img src="https://image.tmdb.org/t/p/original${poster_path}.jpg" />
      </div>
      <div class="modal-description">
        <h2 class="modal-title">${title}</h2>
        <p class="category">${releaseYear} · ${genresString}</p>
        <div class="average-container">
          <p>평균</p>
          <div class="rate average">
            <img src="images/star_filled.png" class="star" />
            <span>${vote_average.toFixed(1)}</span>
          </div>
        </div>
        <hr />
        <div class="rate">
          <p class="point-text">내 별점</p>
          <div class="star-rating">
            <div class="star-wrap">
              ${'<img src="images/star_empty.png" class="star point" />'.repeat(
    5
  )}
            </div>
            <div class="rating-description">
              <p>${ratingDescriptions[defaultRating]}</p>
              <p class="rating">(0/10)</p>
            </div>
          </div>
        </div>
        <hr />
        <div class="detail">
          <p class="detail summary">줄거리</p>
          <p>${overview}</p>
        </div>
      </div>
    </div>
  `;
  $modal.insertBefore($button, $modal.firstChild);
  $modalBackground.appendChild($modal);
  return $modalBackground;
}
const ratingDescriptions = {
  2: "최악이예요",
  4: "별로예요",
  6: "보통이에요",
  8: "재미있어요",
  10: "명작이에요"
};
function MovieModal(movieData, movieId) {
  const $modalBackground = MovieDetailModal(movieData);
  MovieDetail($modalBackground, movieId);
  return $modalBackground;
}
function adaptMovieData(data) {
  if ("genres" in data && data.genres !== void 0) {
    const movieGenres = data.genres;
    const { genres, ...rest } = data;
    return { ...rest, movieGenres };
  }
  return data;
}
const MAXIMUM_PAGE = 500;
class MovieService {
  constructor() {
    __publicField(this, "currentPage");
    __publicField(this, "baseUrl");
    __publicField(this, "totalPages");
    this.currentPage = 1;
    this.totalPages = MAXIMUM_PAGE;
    this.baseUrl = "https://api.themoviedb.org/3";
  }
  async fetchMovies(endPoint, queryParams) {
    if (queryParams.page === MAXIMUM_PAGE + 1) return;
    if (this.currentPage > this.totalPages) return;
    const queryString = new URLSearchParams(
      Object.entries(queryParams).map(([key, value]) => [key, String(value)])
    ).toString();
    const url = `${this.baseUrl}${endPoint}?${queryString}`;
    const response = await fetch(
      url,
      getApiOptions("eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYmY3ZTYzMjRlMTYyMzNlMTY2ZDg5MGQ4YmJmYWUyYSIsIm5iZiI6MTY3OTkyMDIwNC42OTIsInN1YiI6IjY0MjE4YzRjNmEzNDQ4MDExMmJhMThjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.40ExqRMdfCdB6U1T8pL-8WkLX-Xkor7yb__Gjs3zuz0")
    );
    if (response.status === 200) {
      const data = await response.json();
      this.totalPages = data.total_pages;
      this.currentPage++;
      return adaptMovieData(data);
    }
    if (response.status === 500) {
      alert("데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요😅");
    }
    return [];
  }
  initPage() {
    this.currentPage = 1;
  }
}
const STAR_UNIT = 2;
async function openModal(event) {
  const $wrap = document.getElementById("wrap");
  const target = event.currentTarget;
  const movieId = target.dataset.id;
  const movieService = new MovieService();
  const movieData = await movieService.fetchMovies(
    `/movie/${movieId}`,
    getDetailParam()
  );
  const $modal = MovieModal(movieData, movieId);
  $wrap.appendChild($modal);
  document.body.style.overflow = "hidden";
}
function closeModal() {
  const $modalBackground = document.querySelector(".modal-background");
  if ($modalBackground) $modalBackground.remove();
}
function registerModalClose($modal, $modalBackground) {
  const closeButton = $modal.querySelector("#closeModal");
  window.addEventListener("keydown", handleKeyDown);
  $modalBackground.addEventListener("click", handleBackgroundClick);
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeModal();
      document.body.style.overflow = "auto";
    });
  }
  function handleKeyDown(event) {
    if (event.key === "Escape" && !event.isComposing) {
      closeModal();
      document.body.style.overflow = "auto";
    }
  }
  function handleBackgroundClick(event) {
    const target = event.target;
    if (target.className === "modal-background active") {
      closeModal();
    }
  }
}
function updateStarImages($modal, rating = 0) {
  const starElements = $modal.querySelectorAll(
    "img.star.point"
  );
  starElements.forEach((star, idx) => {
    const starRating = (idx + 1) * STAR_UNIT;
    if (starRating <= rating) {
      star.src = "images/star_filled.png";
    } else {
      star.src = "images/star_empty.png";
    }
  });
}
function updateRatingDescription($modal, rating = 0) {
  const ratingDescriptionEl = $modal.querySelector(
    ".rating-description p:nth-child(1)"
  );
  const ratingValueEl = $modal.querySelector(
    ".rating-description .rating"
  );
  const defaultRating = STAR_UNIT;
  if (ratingDescriptionEl && ratingValueEl) {
    if (rating === 0) {
      ratingDescriptionEl.innerText = ratingDescriptions[defaultRating];
      ratingValueEl.innerText = `(0/10)`;
    } else {
      ratingDescriptionEl.innerText = ratingDescriptions[rating];
      ratingValueEl.innerText = `(${rating}/10)`;
    }
  }
}
function setRating($modal, rating = 0) {
  updateStarImages($modal, rating);
  updateRatingDescription($modal, rating);
}
function MovieDetail($modalBackground, movieId) {
  const $modal = $modalBackground.querySelector(".modal");
  const storedRating = localStorage.getItem(movieId);
  let selectedRating = storedRating !== null ? Number(storedRating) : 0;
  registerModalClose($modal, $modalBackground);
  setRating($modal, selectedRating);
  const starElements = $modal.querySelectorAll("img.star.point");
  starElements.forEach((star, index) => {
    star.addEventListener("mouseover", () => {
      if (selectedRating) return;
      const hoverRating = (index + 1) * STAR_UNIT;
      setRating($modal, hoverRating);
    });
    star.addEventListener("click", () => {
      const rating = (index + 1) * STAR_UNIT;
      if (selectedRating === rating) {
        selectedRating = 0;
        setRating($modal);
      } else {
        selectedRating = rating;
        setRating($modal, selectedRating);
        localStorage.setItem(movieId, `${rating}`);
      }
    });
  });
}
function LogoSearchBar() {
  const container = document.createElement("div");
  container.classList.add("logo-searchBar");
  container.innerHTML = `
    <h1 class="logo">
      <img src="images/logo.png" alt="MovieList" />
    </h1>
    <div class="search-container">
      <input placeholder="검색어를 입력하세요." class="search-input"/> 
      <button class="search-button">
        <img src="images/search.svg" alt="검색"/>
      </button> 
    </div>
  `;
  return container;
}
function Header({ id, title, poster_path, vote_average }) {
  const $header = document.createElement("header");
  $header.innerHTML = `
  <div class="background-container">
    <div class="overlay" aria-hidden="true"></div>
      <img src="https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${poster_path}" class="banner"/>
      <div class="top-rated-container">
      ${LogoSearchBar().outerHTML}
      <div class="top-rated-movie">
        <div class="rate">
          <img src="images/star_empty.png" class="star" />
          <span class="rate-value">${vote_average.toFixed(1)}</span>
        </div>
        <div class="title">${title}</div>
        ${Button("자세히 보기", "primary detail").outerHTML}
      </div>
    </div>
  </div>
`;
  const $button = $header.querySelector(".primary.detail");
  $button.dataset.id = id;
  $button.addEventListener("click", openModal);
  return $header;
}
function MovieCaption({ title, vote_average }) {
  const $movieCaption = document.createElement("div");
  $movieCaption.classList.add("item-desc");
  $movieCaption.innerHTML = ` 
  <p class="rate">
    <img src="images/star_empty.png" class="star" />
    <span>${vote_average.toFixed(1)}</span>
  </p>
  <strong>${title}</strong>
`;
  return $movieCaption;
}
function ThumbnailImage({ title, poster_path }) {
  const $thumbnailImage = document.createElement("img");
  $thumbnailImage.classList.add("thumbnail");
  if (!poster_path) {
    $thumbnailImage.src = "./default_poster_image.png";
  } else {
    $thumbnailImage.src = `https://media.themoviedb.org/t/p/w440_and_h660_face${poster_path}`;
  }
  $thumbnailImage.alt = `${title} Thumbnail 이미지`;
  return $thumbnailImage;
}
function MovieItem({ id, title, poster_path, vote_average }, onClick = () => {
}) {
  const $movieItem = document.createElement("li");
  const $movieItemContainer = document.createElement("div");
  $movieItemContainer.classList.add("item");
  $movieItem.dataset.id = id.toString();
  const thumbnailImage = ThumbnailImage({
    title,
    poster_path
  });
  const movieCaption = MovieCaption({
    title,
    vote_average
  });
  $movieItem.addEventListener("click", (event) => onClick(event));
  $movieItemContainer.appendChild(thumbnailImage);
  $movieItemContainer.appendChild(movieCaption);
  $movieItem.appendChild($movieItemContainer);
  return $movieItem;
}
function Skeleton() {
  const $skeletonContainer = document.createElement("li");
  $skeletonContainer.classList.add("skeletonContainer");
  const $skeletonItem = document.createElement("div");
  $skeletonItem.classList.add("skeletonItem");
  const $imageSkeleton = document.createElement("div");
  $imageSkeleton.classList.add("skeleton-image");
  const $captionSkeleton = document.createElement("div");
  $captionSkeleton.classList.add("skeleton-caption");
  $skeletonItem.appendChild($imageSkeleton);
  $skeletonItem.appendChild($captionSkeleton);
  $skeletonContainer.appendChild($skeletonItem);
  return $skeletonContainer;
}
function renderContentHeader($section, contentTitle) {
  const existingHeader = $section.querySelector("h2");
  if (existingHeader) existingHeader.remove();
  const $h2 = document.createElement("h2");
  $h2.innerText = contentTitle;
  $section.prepend($h2);
}
function showSkeleton(count) {
  const $moviesContainer = document.getElementById("movies-container");
  const $listContainer = document.querySelector(".thumbnail-list");
  for (let index = 0; index < count; index++) {
    const skeleton = Skeleton();
    $listContainer == null ? void 0 : $listContainer.appendChild(skeleton);
  }
  $moviesContainer == null ? void 0 : $moviesContainer.appendChild($listContainer);
}
function replaceSkeletonWithMovies(movies) {
  const $skeletonContainers = document.querySelectorAll(".skeletonContainer");
  const $thumbnailList = document.querySelector(".thumbnail-list");
  $skeletonContainers.forEach(($skeletonContainer) => {
    $skeletonContainer.remove();
  });
  movies.forEach((movie) => {
    const $movieItem = MovieItem(movie, (event) => openModal(event));
    $thumbnailList == null ? void 0 : $thumbnailList.appendChild($movieItem);
  });
}
function renderNoResults($main) {
  const existingContentContainer = document.querySelector(".contentContainer");
  if (existingContentContainer) {
    existingContentContainer.remove();
  }
  const $contentContainer = document.createElement("div");
  $contentContainer.classList.add("contentContainer");
  $contentContainer.innerHTML = `
        <img src="/images/no_results.png" alt="검색 결과 없음">
        <div>검색 결과가 없습니다.</div>
    `;
  $main.appendChild($contentContainer);
}
function removeNoResults() {
  const $contentContainer = document.querySelector(".contentContainer");
  if ($contentContainer) $contentContainer.remove();
}
function ContentsContainer(contentTitle, movieList) {
  var _a;
  const $main = document.querySelector("main");
  const $thumbnailList = (_a = document.querySelector(".thumbnail-list")) == null ? void 0 : _a.children;
  renderContentHeader($main, contentTitle);
  replaceSkeletonWithMovies(movieList.movieList);
  if (movieList.movieList.length === 0 && ($thumbnailList == null ? void 0 : $thumbnailList.length) === 0) {
    renderNoResults($main);
  } else {
    removeNoResults();
  }
  if (movieList.movieList.length < 20) {
    const sentinel = document.getElementById(
      "sentinel"
    );
    if (sentinel && sentinel.observer) {
      sentinel.observer.disconnect();
    }
  }
}
class Movie {
  constructor({ id, poster_path, title, vote_average }) {
    __publicField(this, "id");
    __publicField(this, "poster_path");
    __publicField(this, "title");
    __publicField(this, "vote_average");
    this.id = id;
    this.poster_path = poster_path;
    this.title = title;
    this.vote_average = vote_average;
  }
  movieRender() {
    return MovieItem({
      id: this.id,
      title: this.title,
      poster_path: this.poster_path,
      vote_average: this.vote_average
    });
  }
}
class MovieList {
  constructor(movies) {
    __publicField(this, "movieList");
    this.movieList = movies.map(
      ({ id, poster_path, title, vote_average }) => new Movie({ id, poster_path, title, vote_average })
    );
  }
}
function fetchSearchMovies(inputValue, movieService) {
  return movieService.fetchMovies(
    "/search/movie",
    getSearchParam(inputValue, movieService.currentPage)
  );
}
function fetchPopularMovies(movieService) {
  return movieService.fetchMovies(
    "/movie/popular",
    getPopularParam(movieService.currentPage)
  );
}
function validateSearchInput(inputValue) {
  if (inputValue.trim() === "") {
    alert("검색어를 입력해주세요.");
    return false;
  }
  return true;
}
function clickHome() {
  const $logo = document.querySelector(".logo");
  $logo == null ? void 0 : $logo.addEventListener("click", () => {
    location.reload();
  });
}
function removeHeader() {
  const $wrap = document.getElementById("wrap");
  const $header = document.querySelector("header");
  const $logoSearchBar = document.querySelector(
    ".logo-searchBar"
  );
  $logoSearchBar.classList.add("noBanner");
  if ($header) $header.remove();
  $wrap.prepend($logoSearchBar);
}
function clearMoviesContainer() {
  const $listContainer = document.querySelector(".thumbnail-list");
  if ($listContainer) {
    $listContainer.innerHTML = "";
  }
}
async function MovieSearch(inputValue, movieService) {
  if (!validateSearchInput(inputValue)) return;
  const sentinel = document.getElementById("sentinel");
  if (sentinel && sentinel.observer) {
    sentinel.observer.disconnect();
  }
  clearMoviesContainer();
  removeHeader();
  showSkeleton(20);
  const movies = await fetchSearchMovies(inputValue, movieService);
  const movieList = new MovieList(movies.results);
  const searchFetchCallback = () => fetchSearchMovies(inputValue, movieService);
  ContentsContainer(`"${inputValue}" 검색 결과`, movieList);
  setupInfiniteScroll(searchFetchCallback, movieService);
}
async function renderHeader({ id, title, poster_path, vote_average }) {
  const $wrap = document.querySelector("#wrap");
  const $header = Header({
    id,
    title,
    poster_path,
    vote_average
  });
  $wrap == null ? void 0 : $wrap.prepend($header);
}
function renderFooter() {
  const $wrap = document.getElementById("wrap");
  const footer = Footer();
  $wrap == null ? void 0 : $wrap.appendChild(footer);
}
function setupSearchEvents(movieService) {
  const input = document.querySelector(".search-input");
  const button = document.querySelector(".search-button");
  input == null ? void 0 : input.addEventListener("keydown", (event) => {
    const keyboardEvent = event;
    if (keyboardEvent.key === "Enter" && keyboardEvent.isComposing === false) {
      const inputValue = event.target.value;
      movieService.initPage();
      MovieSearch(inputValue, movieService);
    }
  });
  button == null ? void 0 : button.addEventListener("click", () => {
    const inputValue = input == null ? void 0 : input.value;
    movieService.initPage();
    MovieSearch(inputValue, movieService);
  });
}
async function renderInitContent(movieList, movieService) {
  ContentsContainer("지금 인기 있는 영화", movieList);
  setupSearchEvents(movieService);
}
async function loadMoreMovies(fetchMoviesCallback) {
  showSkeleton(20);
  const movies = await fetchMoviesCallback();
  const movieList = new MovieList(movies.results);
  replaceSkeletonWithMovies(movieList.movieList);
}
function setupInfiniteScroll(FetchMoviesCallback2, movieService) {
  const sentinel = document.getElementById("sentinel");
  if (!sentinel) return;
  if (sentinel.observer) {
    sentinel.observer.disconnect();
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && movieService.currentPage - 1 !== movieService.totalPages) {
          loadMoreMovies(FetchMoviesCallback2);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 1
    }
  );
  sentinel.observer = observer;
  observer.observe(sentinel);
}
async function Main() {
  const movieService = new MovieService();
  showSkeleton(20);
  const movies = await fetchPopularMovies(movieService);
  const movieList = new MovieList(movies.results);
  renderHeader(movies.results[0]);
  clickHome();
  renderInitContent(movieList, movieService);
  renderFooter();
  const popularFetchCallback = () => fetchPopularMovies(movieService);
  setupInfiniteScroll(popularFetchCallback, movieService);
}
Main();
