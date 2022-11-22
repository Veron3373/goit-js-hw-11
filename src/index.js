import fetchImeges from './js/fetch';
import { cardTemplate } from './js/template-card'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const endCollection = document.querySelector('.end-collection-text');

function renderCardImage(arr) {
  const markup = arr.map(item => cardTemplate(item)).join('');
  gallery.insertAdjacentHTML('beforeend', markup)
}

form.addEventListener('submit', onSudmitForm)
loadMoreBtn.addEventListener('click', onClickLoadMore)

async function onSudmitForm(event) {
  event.preventDefault();
  window.scrollTo(0, 0)
  searchQuery = event.currentTarget.searchQuery.value.trim();
  currentPage = 1
  console.log(event.currentTarget[0].value)
  if (searchQuery === '') {
    return
  }

  const response = await fetchImeges(searchQuery, currentPage)
  currentHits = response.hits.length

  if (response.totalHits > 40) {
    loadMoreBtn.classList.remove('is-hidden')
  } else {
    loadMoreBtn.classList.add('is-hidden')
  }

  try {
    Notify.success(`Hooray! We found ${response.total} images.`)
    if (response.totalHits > 0) {
      gallery.innerHTML = ''
      renderCardImage(response.hits)
      lightbox.refresh();
      endCollection.classList.add('is-hidden')

      const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: "smooth",
      });
    }
    if (response.totalHits === 0) {
      gallery.innerHTML = ''
      Notify.failure(`Sorry, there are no images matching your search query. Please try again.`)
      endCollection.classList.add('is-hidden')
      loadMoreBtn.classList.add('is-hidden')
    }
  }
  catch (error) {
    console.log(error)
  }
}

async function onClickLoadMore() {
  currentPage += 1;
  const response = await fetchImeges(searchQuery, currentPage)
  renderCardImage(response.hits)
  lightbox.refresh();
  currentHits += response.hits.length
  console.log(response.totalHits)
  console.log(currentHits)
  if (currentHits >= response.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    endCollection.classList.remove('is-hidden');
  }

}