// FILEPATH: c:\Users\johan\Documents\GitHub\Movie-rater\website\script.js

document.addEventListener('DOMContentLoaded', function () {
    // Fetch most rated movie
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&limit=1')
        .then(response => response.json())
        .then(data => {
            const mostRatedSection = document.getElementById('most_rated');
            const mostRatedTitle = data.results[0].title;
            const mostRatedSummary = data.results[0].description;
            const mostRatedBackground = data.results[0].image_url;

            mostRatedSection.style.backgroundImage = `url(${mostRatedBackground})`;
            mostRatedSection.querySelector('h3').innerText = mostRatedTitle;
            mostRatedSection.querySelector('p').innerText = `Synopsis: ${mostRatedSummary}`;
        });

    // Fetch categories and top 3 movies for each category
    fetch('http://localhost:8000/api/v1/genres/')
        .then(response => response.json())
        .then(data => {
            const categorySections = document.querySelectorAll('.category-section');

            data.forEach((category, index) => {
                const currentCategorySection = categorySections[index];
                const categoryName = category.name;

                currentCategorySection.querySelector('h3').innerText = categoryName;

                // Fetch top 3 movies for the current category
                fetch(`http://localhost:8000/api/v1/titles/?genre=${categoryName}&sort_by=-imdb_score&limit=3`)
                    .then(response => response.json())
                    .then(movies => {
                        const movieRectangles = currentCategorySection.querySelectorAll('.category-rectangle');

                        movies.results.forEach((movie, i) => {
                            const movieTitle = movie.title;
                            const movieImage = movie.image_url;

                            const currentMovieRectangle = movieRectangles[i];
                            currentMovieRectangle.querySelector('h4').innerText = movieTitle;
                            currentMovieRectangle.querySelector('img').src = movieImage;
                            currentMovieRectangle.querySelector('img').alt = movieTitle;
                        });
                    });
            });
        });
});
