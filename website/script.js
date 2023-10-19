document.addEventListener('DOMContentLoaded', function () {
    // Constants for API endpoints
    const apiBaseUrl = 'http://localhost:8000/api/v1';
    const topRatedEndpoint = '/titles/?sort_by=-imdb_score&limit=8';

    // Function to fetch data from the API
    async function fetchData(endpoint) {
        try {
            const response = await fetch(`${apiBaseUrl}${endpoint}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to render movie details in a given section
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

    // Function to render movie details in the modal
    function renderModal(movie) {
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = `
            <img src="${movie.image_url}" alt="${movie.title}" class="modal-image">
            <h2 class="modal-title">${movie.title}</h2>
            <p class="modal-info"><span>Genre:</span> ${movie.genres.join(', ')}</p>
            <p class="modal-info"><span>Date de sortie:</span> ${movie.date_published}</p>
            <p class="modal-info"><span>Rated:</span> ${movie.rated}</p>
            <p class="modal-info"><span>Score IMDB:</span> ${movie.imdb_score}</p>
            <p class="modal-info"><span>Réalisateur:</span> ${movie.directors.join(', ')}</p>
            <p class="modal-info"><span>Acteurs:</span> ${movie.actors.join(', ')}</p>
            <p class="modal-info"><span>Durée:</span> ${movie.duration} minutes</p>
            <p class="modal-info"><span>Pays d'origine:</span> ${movie.countries.join(', ')}</p>
            <p class="modal-info"><span>Box Office:</span> ${movie.worldwide_gross_income}</p>
            <p class="modal-info"><span>Résumé:</span> ${movie.description}</p>
            <button id="closeModalButton">Fermer</button>
        `;

        const closeModalButton = document.getElementById('closeModalButton');
        closeModalButton.addEventListener('click', () => {
            document.getElementById('movieModal').style.display = 'none';
        });
    }

    // Function to handle button clicks for showing modal
    function handleDetailsButtonClick(event) {
        const movieId = event.target.dataset.movieId;
        if (movieId) {
            fetchMovieDetails(movieId);
        }
    }

    // Function to fetch detailed movie information
    async function fetchMovieDetails(movieId) {
        const movieDetailsEndpoint = `/titles/${movieId}`;
        const movieDetails = await fetchData(movieDetailsEndpoint);
        renderModal(movieDetails);
        document.getElementById('movieModal').style.display = 'flex';
    }

    // Event listeners
    document.getElementById('bestMovieButton').addEventListener('click', () => {
        fetchMovieDetails(bestMovieId); // Replace bestMovieId with the actual ID
    });

    document.getElementById('scrollLeftButton').addEventListener('click', () => {
        document.getElementById('topRatedMovies').scrollLeft -= 200;
    });

    document.getElementById('scrollRightButton').addEventListener('click', () => {
        document.getElementById('topRatedMovies').scrollLeft += 200;
    });

    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', handleDetailsButtonClick);
    });

    // Initial data loading
    fetchData(topRatedEndpoint).then(data => {
        // Extract the best movie and the rest of the top-rated movies
        const [bestMovie, ...topRatedMovies] = data.results;

        // Render data in respective sections
        renderMovieDetails('bestMovieDetails', [bestMovie]);
        renderMovieDetails('topRatedMovies', topRatedMovies);
    });

// Example for Category 1
const category1Endpoint = '/titles/?genre=action&sort_by=-imdb_score&limit=7';

// Fetch data for Category 1
fetchData(category1Endpoint).then(data => {
    const category1Movies = data.results;
    renderMovieDetails('category1Movies', category1Movies);
});

// Similar code structure can be used for other categories
// Example for Category 2
const category2Endpoint = '/titles/?genre=drama&sort_by=-imdb_score&limit=7';
fetchData(category2Endpoint).then(data => {
    const category2Movies = data.results;
    renderMovieDetails('category2Movies', category2Movies);
});

// Example for Category 3
const category3Endpoint = '/titles/?genre=comedy&sort_by=-imdb_score&limit=7';
fetchData(category3Endpoint).then(data => {
    const category3Movies = data.results;
    renderMovieDetails('category3Movies', category3Movies);
});


});
