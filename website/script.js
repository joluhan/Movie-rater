// TO DO
// make sure to fetch the 7 best movies + also for categories

document.addEventListener('DOMContentLoaded', function () {
    const apiBaseUrl = 'http://localhost:8000/api/v1';
    
    async function fetchData(endpoint) {
      try {
        const response = await fetch(`${apiBaseUrl}${endpoint}`);
        return await response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // Render movie details
    function renderMovieDetails(sectionId, movies, genre) {
      const section = document.getElementById(sectionId);
      section.innerHTML = `<h2>${genre}</h2>`;
      
      // Create a div for the carousel
      const carouselDiv = document.createElement('div');
      carouselDiv.classList.add('categoryMovies');

      movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie', 'glass-box'); // Added 'glass-box'

        movieDiv.innerHTML = `
          <img src="${movie.image_url}" alt="${movie.title}" class="movie-image">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-resume">${movie.summary}</p>
          <button class="details-button" data-movie-id="${movie.id}">Details</button>
        `;

        carouselDiv.appendChild(movieDiv);  // Append movieDiv to carouselDiv
      });

      section.appendChild(carouselDiv);  // Append carouselDiv to section
    }

    // Render modal with movie details ------- ADD ERROR MANAGEMENT IF NO IMG AVAILABLE
    function renderModal(movieDetails) {
        const modal = document.getElementById('movieModal');
        modal.innerHTML = `
          <img src="${movieDetails.image_url}" alt="${movieDetails.title}" class="movie-image">
          <div class="movie-info">
          <h2>${movieDetails.title}</h2>
          <p><strong>Genre:</strong> ${movieDetails.genre}</p>
          <p><strong>Date de sortie:</strong> ${movieDetails.date_published}</p>
          <p><strong>Rated:</strong> ${movieDetails.rated}</p>
          <p><strong>IMDb Score:</strong> ${movieDetails.imdb_score}</p>
          <p><strong>Réalisateur:</strong> ${movieDetails.director}</p>
          <p><strong>Acteurs:</strong> ${movieDetails.actors.join(', ')}</p>
          <p><strong>Durée:</strong> ${movieDetails.duration} mins</p>
          <p><strong>Pays d'origine:</strong> ${movieDetails.countries.join(', ')}</p>
          <p><strong>Box Office:</strong> ${movieDetails.box_office}</p>
          <p><strong>Résumé:</strong> ${movieDetails.description}</p>
          </div>
          <button id="closeModal">Close</button>
        `;
        
        // Add event listener to close modal
        document.getElementById('closeModal').addEventListener('click', () => {
          modal.style.display = 'none';
        });
      }
    // Handle click on details button
    function handleDetailsButtonClick(event) {
      const movieId = event.target.dataset.movieId;
      if (movieId) {
        fetchMovieDetails(movieId);
      }
    }

    function addArrows(sectionId) {
      const section = document.getElementById(sectionId);

      const arrowLeft = document.createElement('div');
      const arrowRight = document.createElement('div');

      arrowLeft.classList.add('arrow', 'arrow-left');
      arrowRight.classList.add('arrow', 'arrow-right');

      section.prepend(arrowLeft);
      section.appendChild(arrowRight);
    
      arrowLeft.addEventListener('click', function() {
        section.scrollBy({ left: -1000, behavior: 'smooth' });
      });
      
      arrowRight.addEventListener('click', function() {
        section.scrollBy({ left: 1000, behavior: 'smooth' });
      });
    }
    
    addArrows('topRatedMovies');
    addArrows('category1Movies');
    addArrows('category2Movies');
    addArrows('category3Movies');

    
    // Fetch movie details and render modal 
    async function fetchMovieDetails(movieId) {
      const movieDetails = await fetchData(`/titles/${movieId}`);
      renderModal(movieDetails);
      document.getElementById('movieModal').style.display = 'flex';
    }
  
    // Add event listener to document to handle click on details button
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('details-button')) {
        handleDetailsButtonClick(event);
      }
    });
  
    // Fetch data for best movie and top rated movies
    fetchData('/titles/?sort_by=-imdb_score&limit=8').then(data => {
      const [bestMovie, ...topRatedMovies] = data.results;
      renderMovieDetails('bestMovieDetails', [bestMovie], 'Best Movie');
     // Special Treatment for Best Movie
      const bestMovieDiv = document.getElementById('bestMovieDetails');
      bestMovieDiv.classList.remove('categoryMovies');  // Remove categoryMovies class
      bestMovieDiv.firstChild.classList.add('glass-box');  // Add 'glass-box'

      renderMovieDetails('topRatedMovies', topRatedMovies, 'Top Rated Movies');
    });
    
    // Define categories
    const categories = [
      {endpoint: '/titles/?genre=action&sort_by=-imdb_score&limit=7', sectionId: 'category1Movies', genre: 'Action'},
      {endpoint: '/titles/?genre=drama&sort_by=-imdb_score&limit=7', sectionId: 'category2Movies', genre: 'Drama'},
      {endpoint: '/titles/?genre=comedy&sort_by=-imdb_score&limit=7', sectionId: 'category3Movies', genre: 'Comedy'}
    ];
  
    // Fetch data for each category and render it
    categories.forEach(category => {
      fetchData(category.endpoint).then(data => {
        renderMovieDetails(category.sectionId, data.results, category.genre);
      });
    });
  });
  