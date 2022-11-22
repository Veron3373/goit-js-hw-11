import axios from 'axios';


export default async function fetchImeges(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '30650907-423370a702b18ed589e3182b5';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  return await axios
    .get(`${url}${filter}`)
    .then(response => response.data)
}