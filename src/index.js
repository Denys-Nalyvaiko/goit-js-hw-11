import { fetchPixabayImages } from './js/pixabay-api';
import { Notify } from 'notiflix';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchBtn: document.querySelector('#search-btn'),
  galleryContainer: document.querySelector('#gallery'),
  loadMoreBtn: document.querySelector('#load-more'),
};

let searchQueryValue = '';
let page = 1;

refs.loadMoreBtn.disabled = true;

Notify.init({
  position: 'center-top',
  distance: '45px',
  timeout: 2000,
  cssAnimationStyle: 'zoom',
  fontFamily: 'Arial, sans-serif',
});

refs.searchForm.addEventListener('submit', handleFormSearchSubmit);
refs.loadMoreBtn.addEventListener('click', handleLoadMoreClick);

async function handleFormSearchSubmit(event) {
  event.preventDefault();
  refs.searchBtn.disabled = true;

  searchQueryValue = event.currentTarget.elements.searchQuery.value;

  try {
    const imagesData = await fetchPixabayImages(searchQueryValue, page);
    refs.galleryContainer.innerHTML = createGalleryMarkup(imagesData.hits);
    refs.searchBtn.disabled = false;
    refs.loadMoreBtn.disabled = false;
  } catch {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function handleLoadMoreClick() {
  page += 1;

  try {
    const imagesData = await fetchPixabayImages(searchQueryValue, page);
    refs.galleryContainer.insertAdjacentHTML(
      'beforeend',
      createGalleryMarkup(imagesData.hits)
    );
    refs.loadMoreBtn.disabled = false;
  } catch {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function createGalleryMarkup(imagesData) {
  return imagesData.map(createImageMarkup).join();
}

function createImageMarkup({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
  <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width=320 />
    <div class="info">
      <p class="info-item">
        <b>Likes</b><span>${likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b><span>${views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b><span>${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b><span>${downloads}</span>
      </p>
    </div>
  </div>`;
}
