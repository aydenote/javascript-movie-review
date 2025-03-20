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
    <p><img src="./woowacourse_logo.png" width="180" /></p>`;
  return $footer;
}
function LogoSearchBar() {
  const container = document.createElement("div");
  container.innerHTML = `
    <h1 class="logo">
      <img src="./logo.png" alt="MovieList" />
    </h1>
    <div class="search-container">
      <input placeholder="검색어를 입력하세요." class="search-input"/> 
      <button class="search-button">
        <img src="./search.svg" alt="검색"/>
      </button> 
    </div>
  `;
  return container;
}
function Header({ title, poster_path, vote_average }) {
  const $header = document.createElement("header");
  $header.innerHTML = `
  <div class="background-container">
    <div class="overlay" aria-hidden="true">  
    </div>
    <img src="https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${poster_path}" class="banner"/>
    <div class="top-rated-container">
    <div class="top-rated-movie">
      <div class="rate">
        <img src="./star_empty.png" class="star" />
        <span class="rate-value">${vote_average.toFixed(1)}</span>
      </div>
      <div class="title">${title}</div>
      <button class="primary detail">자세히 보기</button>
    </div>
  </div>
</div>
`;
  return $header;
}
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwYmY3ZTYzMjRlMTYyMzNlMTY2ZDg5MGQ4YmJmYWUyYSIsIm5iZiI6MTY3OTkyMDIwNC42OTIsInN1YiI6IjY0MjE4YzRjNmEzNDQ4MDExMmJhMThjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.40ExqRMdfCdB6U1T8pL-8WkLX-Xkor7yb__Gjs3zuz0"}`
  }
};
class MovieService {
  constructor() {
    __publicField(this, "currentPage");
    __publicField(this, "baseUrl");
    this.currentPage = 1;
    this.baseUrl = "https://api.themoviedb.org/3";
  }
  async getPopularMovies() {
    const response = await fetch(
      `${this.baseUrl}/movie/popular?language=ko-KR&page=${this.currentPage}`,
      options
    );
    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
    if (response.status === 500) {
      alert("데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요😅");
    }
    return [];
  }
  async getSearchResult(searchWord) {
    const response = await fetch(
      `${this.baseUrl}/search/movie?query=${searchWord}&include_adult=false?language=ko-KR&page=${this.currentPage}`,
      options
    );
    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
    if (response.status === 500) {
      alert("데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요😅");
    }
    return [];
  }
  nextPage() {
    this.currentPage = this.currentPage + 1;
  }
  getCurrentPage() {
    return this.currentPage;
  }
}
function Button(text, className = "button", onClick) {
  const $button = document.createElement("button");
  $button.classList.add(className);
  $button.innerText = text;
  $button.addEventListener("click", onClick);
  return $button;
}
function MovieCaption({ title, vote_average }) {
  const $movieCaption = document.createElement("div");
  $movieCaption.classList.add("item-desc");
  $movieCaption.innerHTML = ` 
  <p class="rate">
    <img src="./star_empty.png" class="star" />
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
function MovieItem({ title, poster_path, vote_average }) {
  const $movieItem = document.createElement("li");
  const $movieItemContainer = document.createElement("div");
  $movieItemContainer.classList.add("item");
  const thumbnailImage = ThumbnailImage({
    title,
    poster_path
  });
  const movieCaption = MovieCaption({
    title,
    vote_average
  });
  $movieItemContainer.appendChild(thumbnailImage);
  $movieItemContainer.appendChild(movieCaption);
  $movieItem.appendChild($movieItemContainer);
  return $movieItem;
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
      title: this.title,
      poster_path: this.poster_path,
      vote_average: this.vote_average
    });
  }
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
class MovieList {
  constructor(movies) {
    __publicField(this, "movieList");
    this.movieList = movies.map(
      ({ id, poster_path, title, vote_average }) => new Movie({ id, poster_path, title, vote_average })
    );
  }
  renderMovieList() {
    const $listContainer = document.createElement("ul");
    $listContainer.classList.add("thumbnail-list");
    this.movieList.forEach((movieInstance) => {
      const $skeleton = Skeleton();
      $listContainer.appendChild($skeleton);
      setTimeout(() => {
        const $movie = movieInstance.movieRender();
        $listContainer.replaceChild($movie, $skeleton);
      }, 2e3);
    });
    return $listContainer;
  }
}
const MAXIMUM_PAGE = 500;
async function ContentsContainer(results, contentTitle) {
  var _a;
  const $main = document.querySelector("main");
  const movieService = new MovieService();
  const movieList = new MovieList(results);
  const $listContainer = movieList.renderMovieList();
  const $section = document.querySelector("section");
  const $h2 = document.createElement("h2");
  $h2.innerText = contentTitle;
  $section == null ? void 0 : $section.appendChild($h2);
  $section == null ? void 0 : $section.appendChild($listContainer);
  removeButton();
  const $button = Button("더 보기", "more", clickMoreMovies);
  $main == null ? void 0 : $main.appendChild($button);
  if (document.querySelector(".contentContainer")) {
    (_a = document.querySelector(".contentContainer")) == null ? void 0 : _a.remove();
  }
  const $contentContainer = document.createElement("div");
  $contentContainer.classList.add("contentContainer");
  if (results.length === 0) {
    $contentContainer.innerHTML = `
        <img src="./no_results.png">
        <div>검색 결과가 없습니다.</div>
    `;
    $main == null ? void 0 : $main.appendChild($contentContainer);
    removeButton();
  }
  async function clickMoreMovies(event) {
    movieService.nextPage();
    const additionalData = await movieService.getPopularMovies();
    const movieList2 = new MovieList(additionalData.results);
    const $listContainer2 = movieList2.renderMovieList();
    const $section2 = document.querySelector("section");
    const $moreButton = event.target;
    if (movieService.currentPage === MAXIMUM_PAGE) {
      $moreButton.remove();
    }
    $section2 == null ? void 0 : $section2.appendChild($listContainer2);
  }
  function removeButton() {
    const existingButton = $main == null ? void 0 : $main.querySelector("button.more");
    if (existingButton) {
      existingButton.remove();
    }
  }
}
function renderHeader({ title, poster_path, vote_average }) {
  var _a;
  const $container = document.querySelector("#wrap");
  const $header = Header({ title, poster_path, vote_average });
  const $logoSearchBar = LogoSearchBar();
  (_a = $header.querySelector(".top-rated-container")) == null ? void 0 : _a.prepend($logoSearchBar);
  $container == null ? void 0 : $container.prepend($header);
}
async function renderContent(movieService, results) {
  const $input = document.querySelector(".search-input");
  const $button = document.querySelector(".search-button");
  const $section = document.querySelector("section");
  ContentsContainer(results, "지금 인기 있는 영화");
  $input == null ? void 0 : $input.addEventListener("keydown", async (event) => {
    const keyboardEvent = event;
    if (keyboardEvent.key === "Enter") {
      const inputValue = event.target.value;
      if (inputValue === "") {
        alert("검색어를 입력해주세요.");
      } else {
        const searchResult = await movieService.getSearchResult(inputValue);
        if ($section) {
          $section.innerHTML = "";
        }
        ContentsContainer(searchResult.results, `"${inputValue}" 검색 결과`);
      }
    }
  });
  $button == null ? void 0 : $button.addEventListener("click", async () => {
    const inputValue = $input == null ? void 0 : $input.value;
    if (inputValue === "") {
      alert("검색어를 입력해주세요.");
    } else {
      const searchResult = await movieService.getSearchResult(inputValue);
      if ($section) {
        $section.innerHTML = "";
      }
      ContentsContainer(searchResult.results, `"${inputValue}" 검색 결과`);
    }
  });
}
function renderFooter() {
  const $container = document.querySelector("#wrap");
  const $footer = Footer();
  $container == null ? void 0 : $container.appendChild($footer);
}
async function main() {
  const movieService = new MovieService();
  const data = await movieService.getPopularMovies();
  renderHeader(data.results[0]);
  renderContent(movieService, data.results);
  renderFooter();
}
main();
