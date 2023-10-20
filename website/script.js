// When the document is fully loaded, execute the following code
document.addEventListener('DOMContentLoaded', function () {
  
    // API base URL
    const apiBaseUrl = 'http://localhost:8000/api/v1';
    
    // API endpoint for top-rated movies
    const topRatedEndpoint = '/titles/?sort_by=-imdb_score&limit=8';
    
    // Fetch data from API
    async function fetchData(endpoint) {
      try {
        const response = await fetch(`${apiBaseUrl}${endpoint}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    // Render movie details into HTML
    function renderMovieDetails(sectionId, movies) {
      const section = document.getElementById(sectionId);
      section.innerHTML = '';
      movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
          <img src="${movie.image_url}" alt="${movie.title}" class="movie-image">
          <h3 class="movie-title">${movie.title}</h3>
          <button class="details-button" data-movie-id="${movie.id}">Détails</button>
        `;
        section.appendChild(movieDiv);
      });
    }
    
    // Handle details button click
    function handleDetailsButtonClick(event) {
      const movieId = event.target.dataset.movieId;
      if (movieId) {
        fetchMovieDetails(movieId);
      }
    }
    
    // Fetch detailed movie information
    async function fetchMovieDetails(movieId) {
      const movieDetailsEndpoint = `/titles/${movieId}`;
      const movieDetails = await fetchData(movieDetailsEndpoint);
      renderModal(movieDetails);
      document.getElementById('movieModal').style.display = 'flex';
    }
    
    // Delegate click event to handle details button clicks
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('details-button')) {
        handleDetailsButtonClick(event);
      }
    });
  
    // Fetch and display top-rated movies
    fetchData(topRatedEndpoint).then(data => {
      const [bestMovie, ...topRatedMovies] = data.results;
      const bestMovieId = bestMovie.id;
      
      renderMovieDetails('bestMovieDetails', [bestMovie]);
      renderMovieDetails('topRatedMovies', topRatedMovies);
  
      // Event Listener for the best movie button
      document.getElementById('bestMovieButton').addEventListener('click', () => {
        fetchMovieDetails(bestMovieId);
      });
    });
  
    // Fetch and display category movies
    const category1Endpoint = '/titles/?genre=action&sort_by=-imdb_score&limit=7';
    fetchData(category1Endpoint).then(data => {
      renderMovieDetails('category1Movies', data.results);
    });
  
    const category2Endpoint = '/titles/?genre=drama&sort_by=-imdb_score&limit=7';
    fetchData(category2Endpoint).then(data => {
      renderMovieDetails('category2Movies', data.results);
    });
  
    const category3Endpoint = '/titles/?genre=comedy&sort_by=-imdb_score&limit=7';
    fetchData(category3Endpoint).then(data => {
      renderMovieDetails('category3Movies', data.results);
    });
  
  });
  