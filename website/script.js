document.addEventListener('DOMContentLoaded', function () {
  const baseURL = 'http://localhost:8000/api/v1/titles/';

  // Fetch movies and return JSON data
  function fetchMovies(url) {
      return fetch(url).then(response => response.json());
  }

  // Display the best movie in its section
  function displayBestMovie() {
      fetchMovies(`${baseURL}?sort_by=-imdb_score`).then(data => {
          const bestMovie = data.results[0];
          fetchMovies(`${baseURL}${bestMovie.id}`).then(movie => {
              const bestMovieElement = createMovieElement(movie, true);
              document.getElementById('bestMovieDetails').appendChild(bestMovieElement);
          });
      });
  }

  // Display movies in a given section
  function displayMoviesInSection(url, sectionId, sectionTitle) {
      fetchMovies(url).then(data => {
        const section = document.getElementById(sectionId);
        const carousel = section.querySelector('.carousel');
        data.results.forEach(movie => {
            const movieElement = createMovieElement(movie);
            carousel.appendChild(movieElement);
        });
        section.querySelector('h2').innerText = sectionTitle;

    });
}

  // Create a movie element for the DOM
  function createMovieElement(movie, isBestMovie = false) {
      const movieDiv = document.createElement('div');
      movieDiv.className = isBestMovie ? 'best-movie' : 'movie-glass-box';
      movieDiv.innerHTML = `
          <div class='movie-image'>
              <img src="${movie.image_url}" alt="${movie.title}" class="movie-image" onerror="changeImageOnError(this)" />
          </div>
          <div class="movie-details">
              <h3>${movie.title}</h3>
              ${isBestMovie ? `<p>${movie.description}</p>` : ''}
              <button class="details-button" onclick="openModal(${movie.id})">Détails</button>
          </div>
      `;
      return movieDiv;
  }

  // Function to open a modal with movie details
  window.openModal = function (movieId) {
      fetchMovies(`${baseURL}${movieId}`).then(movie => {
          const modal = document.getElementById('movieModal');
          modal.style.display = 'block';
          modal.querySelector('.modal-content').innerHTML = `
              <span class="close" onclick="closeModal()">&times;</span>
              <h2>${movie.title}</h2>
              <img src="${movie.image_url}" alt="${movie.title}" class="movie-image" />
              <p><strong>Genre:</strong> ${movie.genres.join(', ')}</p>
              <p><strong>Date Published:</strong> ${movie.date_published}</p>
              <p><strong>Rating:</strong> ${movie.rated}</p>
              <p><strong>IMDb Score:</strong> ${movie.imdb_score}</p>
              <p><strong>Director:</strong> ${movie.directors.join(', ')}</p>
              <p><strong>Actors:</strong> ${movie.actors.join(', ')}</p>
              <p><strong>Duration:</strong> ${movie.duration} minutes</p>
              <p><strong>Country:</strong> ${movie.countries.join(', ')}</p>
              <p><strong>Box Office:</strong> ${movie.worldwide_gross_income ? movie.worldwide_gross_income : 'N/A'}</p>
              <p><strong>Summary:</strong> ${movie.long_description}</p>
          `;
      });
  };

  // Function to close the modal
  window.closeModal = function () {
      const modal = document.getElementById('movieModal');
      modal.style.display = 'none';
  };

  // Function to set up carousel scrolling
  function setupCarouselScrolling() {
      const carousels = document.querySelectorAll('.movie-carousel');
      carousels.forEach(carousel => {
          const prevButton = carousel.querySelector('.prev-button');
          const nextButton = carousel.querySelector('.next-button');
          const carouselContainer = carousel.querySelector('.carousel');

          prevButton.addEventListener('click', () => {
              carouselContainer.scrollLeft -= carouselContainer.offsetWidth / 4;
          });

          nextButton.addEventListener('click', () => {
              carouselContainer.scrollLeft += carouselContainer.offsetWidth / 4;
          });
      });
  }

  // Display movies for each category
  function displayCategoryMovies() {
      // Define categories and corresponding section IDs
      const categories = [
          { name: 'Action', section: 'category1Movies' },
          { name: 'Drama', section: 'category2Movies' },
          { name: 'Comedy', section: 'category3Movies' }
      ];

      // Fetch and display movies for each category
      categories.forEach(category => {
          const url = `${baseURL}?genre=${category.name}&sort_by=-imdb_score&page_size=7`;
          displayMoviesInSection(url, category.section, category.name);
      });
  }

  // Initialize the page by displaying movies
  displayBestMovie();
  displayMoviesInSection(`${baseURL}?sort_by=-imdb_score&page_size=7`, 'topRatedMovies', 'Films Les Mieux Notés');
  displayCategoryMovies();
  setupCarouselScrolling();
});

function changeImageOnError(image) {
  // Change the image source URL to the backup image
  // image.src = "placeholder.jpg";
  image.remove();
}