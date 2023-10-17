// Fetch the most rated movie with IMDb score less than a specific value
fetch('http://localhost:8000/api/v1/titles/?imdb_score_max=10&sort_by=-imdb_score')
    .then(response => response.json())
    .then(data => {
        // Assuming the first item in the response is the most rated movie
        const mostRatedMovie = data.results[0];

        // Convert the movie information to JSON
        const jsonContent = JSON.stringify(mostRatedMovie, null, 2);

        // Save the JSON content to a file named 'mostRatedMovie.json'
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'mostRatedMovie.json';
        link.click();
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
    });
