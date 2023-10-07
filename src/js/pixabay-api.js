import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39895100-b1bc415b383dfc0e1a37c2dc7';

export async function fetchPixabayImages(query, page = 1) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page,
  });

  const responce = await axios.get(`${BASE_URL}?${params}`);

  return responce.data;
}
