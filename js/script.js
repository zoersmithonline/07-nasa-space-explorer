const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');
const loadingMessage = document.getElementById('loadingMessage');

setupDateInputs(startInput, endInput);

const API_KEY = 'DEMO_KEY';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

function getDaysInRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start) || isNaN(end) || start > end) return 0;
  const diff = end - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function validateDateRange(startDate, endDate) {
  const days = getDaysInRange(startDate, endDate);
  if (days < 10) {
    gallery.innerHTML = '<p>Please select a date range of at least 10 days.</p>';
    return false;
  }
  return true;
}

async function fetchImages(startDate, endDate) {
  if (!startDate || !endDate) {
    gallery.innerHTML = '<p>Please select a valid start and end date.</p>';
    return;
  }

  loader.classList.remove('hidden');
  loadingMessage.classList.remove('hidden');
  gallery.innerHTML = '';

  try {
    const res = await fetch(`${BASE_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`);
    if (!res.ok) {
      const errorResponse = await res.json();
      throw new Error(errorResponse.error?.message || 'Unable to load images');
    }

    const data = await res.json();
    const images = Array.isArray(data) ? data : [data];

    if (images.length === 0) {
      gallery.innerHTML = '<p>No images found for that date range.</p>';
    } else {
      displayImages(images.reverse());
    }
  } catch (e) {
    gallery.innerHTML = `<p>Error loading images: ${e.message}</p>`;
  }

  loader.classList.add('hidden');
  loadingMessage.classList.add('hidden');
}

button.addEventListener('click', () => {
  if (!validateDateRange(startInput.value, endInput.value)) return;
  fetchImages(startInput.value, endInput.value);
});

function displayImages(images) {
  images.forEach(item => {
    if (item.media_type !== 'image') return;

    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    galleryItem.innerHTML = `
      <img src="${item.url}" alt="${item.title}" />
      <p><strong>${item.title}</strong></p>
    `;

    galleryItem.addEventListener('click', () => {
      openModal(item);
    });

    gallery.appendChild(galleryItem);
  });
}

function openModal(item) {
  const modal = document.createElement('div');
  modal.className = 'modal';

  const modalBox = document.createElement('div');
  modalBox.className = 'modal-box';

  const closeButton = document.createElement('span');
  closeButton.className = 'close';
  closeButton.textContent = '×';

  const image = document.createElement('img');
  image.src = item.hdurl || item.url;
  image.alt = item.title;

  const title = document.createElement('h2');
  title.textContent = item.title;

  const dateText = document.createElement('p');
  dateText.className = 'modal-date';
  dateText.textContent = item.date;

  const explanation = document.createElement('p');
  explanation.className = 'modal-text';
  explanation.textContent = item.explanation;

  modalBox.appendChild(closeButton);
  modalBox.appendChild(image);
  modalBox.appendChild(title);
  modalBox.appendChild(dateText);
  modalBox.appendChild(explanation);
  modal.appendChild(modalBox);
  document.body.appendChild(modal);

  const closeModal = () => {
    document.body.removeChild(modal);
    document.removeEventListener('keydown', handleEscape);
  };

  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  document.addEventListener('keydown', handleEscape);
}

