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
  
    function renderMovieDetails(sectionId, movies, genre) {
      const section = document.getElementById(sectionId);
      section.innerHTML = `<h2>${genre}</h2>`;
      
      movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
          <img src="${movie.image_url}" alt="${movie.title}" class="movie-image">
          <h3 class="movie-title">${movie.title}</h3>
          <button class="details-button" data-movie-id="${movie.id}">Details</button>
        `;
        section.appendChild(movieDiv);
      });
    }
  
    function handleDetailsButtonClick(event) {
      const movieId = event.target.dataset.movieId;
      if (movieId) {
        fetchMovieDetails(movieId);
      }
    }
  
    async function fetchMovieDetails(movieId) {
      const movieDetails = await fetchData(`/titles/${movieId}`);
      renderModal(movieDetails);
      document.getElementById('movieModal').style.display = 'flex';
    }
  
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('details-button')) {
        handleDetailsButtonClick(event);
      }
    });
  
    fetchData('/titles/?sort_by=-imdb_score&limit=8').then(data => {
      const [bestMovie, ...topRatedMovies] = data.results;
      renderMovieDetails('bestMovieDetails', [bestMovie], 'Best Movie');
      renderMovieDetails('topRatedMovies', topRatedMovies, 'Top Rated Movies');
    });
  
    const categories = [
      {endpoint: '/titles/?genre=action&sort_by=-imdb_score&limit=7', sectionId: 'category1Movies', genre: 'Action'},
      {endpoint: '/titles/?genre=drama&sort_by=-imdb_score&limit=7', sectionId: 'category2Movies', genre: 'Drama'},
      {endpoint: '/titles/?genre=comedy&sort_by=-imdb_score&limit=7', sectionId: 'category3Movies', genre: 'Comedy'}
    ];
  
    categories.forEach(category => {
      fetchData(category.endpoint).then(data => {
        renderMovieDetails(category.sectionId, data.results, category.genre);
      });
    });
  });
  