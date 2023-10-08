import { fetchPixabayImages } from './js/pixabay-api';
import { createGalleryMarkup } from './js/templates/gallery-markup';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchBtn: document.querySelector('#search-btn'),
  galleryContainer: document.querySelector('#gallery'),
  loadMoreBtn: document.querySelector('#load-more'),
};

let searchQueryValue = '';
let page = 1;
let lightbox = {};

refs.loadMoreBtn.hidden = true;

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

  searchQueryValue = event.currentTarget.elements.searchQuery.value;
  page = 1;

  if (!searchQueryValue.trim()) {
    Notify.warning('You should enter something.');
    return;
  }

  refs.searchBtn.disabled = true;

  try {
    const imagesData = await fetchPixabayImages(searchQueryValue, page);
    refs.galleryContainer.innerHTML = createGalleryMarkup(imagesData.hits);
  } catch {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  refs.searchBtn.disabled = false;
  refs.loadMoreBtn.hidden = false;

  lightbox = new SimpleLightbox('.gallery a');
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

    if (page * imagesData.hits.length >= imagesData.totalHits) {
      refs.loadMoreBtn.disabled = true;
    }
  } catch {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  lightbox.refresh();
}
