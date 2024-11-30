const apiKey = '5311371d6c5f1bf83718e50f58f8f076';
const carouselContainer = document.getElementById("carousel-items");
const movieDataContainer = document.getElementById("movie-list");
const seriesDataContainer = document.getElementById("series-list");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Default Trending Movies API
const trendingMoviesUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;

// Fetch and Render Trending Movies for Carousel and Grid
fetch(trendingMoviesUrl)
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        const movies = data.results;

        // Populate the carousel with the first 5 movies
        populateCarousel(movies.slice(0, 5));

        // Populate the grid with the remaining movies
        populateGrid(movies.slice(5));
    })
    .catch(error => {
        console.error('Error fetching trending movies:', error);
        carouselContainer.innerHTML = `<p class="text-danger">Failed to load latest movies. Please try again.</p>`;
        movieDataContainer.innerHTML = `<p class="text-danger">Failed to load more movies. Please try again.</p>`;
    });

// Function to Populate Carousel
function populateCarousel(movies) {
    carouselContainer.innerHTML = movies.map((movie, index) => {
        const activeClass = index === 0 ? 'active' : ''; // Make the first slide active
        return `
            <div class="carousel-item ${activeClass}">
                <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" 
                     class="d-block img-fluid"  style="height: auto ; width: 20%;"
                     alt="${movie.title}">
                <h5>${movie.title}</h5>
            </div>
        `;
    }).join('');
}

// Function to Populate Grid
function populateGrid(movies) {
    movieDataContainer.innerHTML = movies.map(movie => {
        const posterPath = movie.poster_path 
            ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` 
            : 'https://via.placeholder.com/500x750';
        return `
            <div class="col-md-4 col-sm-6 col-lg-3 col-xl-2 mb-4">
                <div class="card bg-dark text-white h-100">
                    <img src="${posterPath}" class="card-img-top img-fluid rounded" alt="${movie.title}">
                    <div class="card-body d-flex flex-column text-center">
                        <h6 class="card-title mb-2 mt-2">${movie.title}</h6>
                        <a href="/watch.html?id=${movie.id}" class="btn btn-primary btn-sm mt-auto">Watch Now</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Handle Search Form Submission
searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    const query = searchInput.value.trim();
    if (query) {
        const searchMoviesUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        const searchSeriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

        // Fetch and display search results
        fetchAndRenderResults(searchMoviesUrl, movieDataContainer);
        fetchAndRenderResults(searchSeriesUrl, seriesDataContainer);
    } else {
        alert("Please enter a search term.");
    }
});

// Function to Fetch and Render Movies or Series (for Search)
const fetchAndRenderResults = (url, container) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            container.innerHTML = ""; // Clear previous results
            data.results.forEach(item => {
                const title = item.title || item.name; // Movies use "title", series use "name"
                container.innerHTML += `
                    <div class="col-md-4 col-sm-6 col-lg-3 col-xl-2 mb-4">
                        <div class="card bg-dark text-white h-100">
                            <img src="https://image.tmdb.org/t/p/original/${item.poster_path}" class="card-img-top img-fluid" alt="${title}">
                            <div class="card-body d-flex flex-column text-center">
                                <h6 class="card-title mb-2">${title}</h6>
                                <a href="/watch.html?id=${item.id}" class="btn btn-primary btn-sm mt-auto">Watch Now</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            container.innerHTML = `<p class="text-danger">Failed to load data. Please try again.</p>`;
        });
};
