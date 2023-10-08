import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchPixabayImages } from './js/pixabay-api';
import { createGalleryMarkup } from './js/templates/gallery-markup';

const refs = {
  searchForm: document.querySelector('#search-form'),
  searchBtn: document.querySelector('#search-btn'),
  galleryContainer: document.querySelector('#gallery'),
};

let searchQueryValue = '';
let page = 1;
let lightbox = {};

Notify.init({
  position: 'center-top',
  distance: '45px',
  timeout: 2000,
  cssAnimationStyle: 'zoom',
  fontFamily: 'Arial, sans-serif',
});

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(handleLoadMoreObserve, options);
const target = document.querySelector('#target');

refs.searchForm.addEventListener('submit', handleFormSearchSubmit);

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
    observer.observe(target);
  } catch {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  refs.searchBtn.disabled = false;

  lightbox = new SimpleLightbox('.gallery a');
}

async function handleLoadMoreObserve(entries, observer) {
  entries.forEach(async entry => {
    if (!entry.isIntersecting) {
      return;
    }

    page += 1;

    try {
      const imagesData = await fetchPixabayImages(searchQueryValue, page);
      refs.galleryContainer.insertAdjacentHTML(
        'beforeend',
        createGalleryMarkup(imagesData.hits)
      );

      if (page * imagesData.hits.length >= imagesData.totalHits) {
        observer.unobserve(target);
      }
    } catch {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    lightbox.refresh();
  });
}
