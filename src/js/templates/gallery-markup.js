export function createGalleryMarkup(imagesData) {
  return imagesData.map(createImageMarkup).join('');
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
