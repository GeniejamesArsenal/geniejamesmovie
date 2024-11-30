const apiKey = '5311371d6c5f1bf83718e50f58f8f076';

// Select containers
const player = document.getElementById('watch-movie');
const detailsContainer = document.getElementById('movie-details');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Get URL parameters for movie ID
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const watch_id = urlParams.get('id');

// Embed the movie player
if (watch_id) {
    const version = "v2"; // Set the correct version (e.g., "v2")
    const embedUrl = `https://vidsrc.cc/${version}/embed/movie/${watch_id}?autoPlay=false`;

    player.innerHTML = `
        <iframe 
            src="${embedUrl}" 
            width="100%" 
            height="500" 
            frameborder="0" 
            allow="autoplay; fullscreen" 
            allowfullscreen>
        </iframe>`;
} else {
    player.innerHTML = `<p class="text-danger">Error: Movie ID is missing or invalid.</p>`;
}

// Fetch and display movie details using TMDb API
if (watch_id) {
    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${watch_id}?api_key=${apiKey}&language=en-US`;

    fetch(movieDetailsUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const { title, overview, poster_path, release_date, genres } = data;
            const genreList = genres.map(genre => genre.name).join(', ');

            detailsContainer.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="https://image.tmdb.org/t/p/original/${poster_path}" alt="${title}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-8">
                        <h2>${title}</h2>
                        <p><strong>Release Date:</strong> ${release_date}</p>
                        <p><strong>Genres:</strong> ${genreList}</p>
                        <p><strong>Overview:</strong> ${overview}</p>
                    </div>
                </div>`;
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
            detailsContainer.innerHTML = `<p class="text-danger">Failed to load movie details. Please try again later.</p>`;
        });
}

// Search Form Submission
searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const query = searchInput.value.trim();
    if (query) {
        searchMovies(query);
    } else {
        alert('Please enter a search term.');
    }
});

// Search Movies from TMDb API
function searchMovies(query) {
    const searchMoviesUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US`;
    const searchSeriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US`;

    Promise.all([
        fetch(searchMoviesUrl),
        fetch(searchSeriesUrl)
    ])
        .then(([movieResponse, seriesResponse]) => {
            if (!movieResponse.ok || !seriesResponse.ok) {
                throw new Error('Error fetching search results');
            }

            return Promise.all([movieResponse.json(), seriesResponse.json()]);
        })
        .then(([movieData, seriesData]) => {
            searchResults.innerHTML = '';
            displaySearchResults(movieData.results, 'Movie', searchResults);
            displaySearchResults(seriesData.results, 'Series', searchResults);
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            searchResults.innerHTML = `<p class="text-danger">Failed to load search results. Please try again later.</p>`;
        });
}

// Display search results
function displaySearchResults(results, type, container) {
    results.forEach(item => {
        const title = item.title || item.name; // Movies use "title", series use "name"
        const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/original/${item.poster_path}` : 'https://via.placeholder.com/500';
        const itemId = item.id;
        const itemLink = `/watch.html?id=${itemId}`;

        container.innerHTML += `
            <div class="col-md-4 col-sm-6 col-lg-3 col-xl-2">
                <img src="${posterPath}" alt="${title}" class="img-fluid rounded">
                <a href="${itemLink}" class="d-block mt-2" data-bs-theme="dark">${title}</a>
                <p class="text-muted">${type}</p>
            </div>
        `;
    });
}