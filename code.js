const apiKey = '5311371d6c5f1bf83718e50f58f8f076';
const movieDataContainer = document.getElementById("movie-list");
const seriesDataContainer = document.getElementById("series-list");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Default Trending Movies API
const trendingMoviesUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
const trendingSeriesUrl = `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`;

// Function to Fetch and Render Movies or Series
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
                    <div class="col-md-4 col-sm-6 col-lg-3 col-xl-2 mb-4  "> 
                        <div class="card h-100 ">
                            <img src="https://image.tmdb.org/t/p/original/${item.poster_path}" class="card-img-top" alt="${title}">
                            <div class="card-body">
                                <h5 class="card-title">${title}</h5>
                                <a href="/watch.html?id=${item.id}" class="btn btn-primary mt-2">Watch Now</a>
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

// Load Default Trending Movies and Series
fetchAndRenderResults(trendingMoviesUrl, movieDataContainer);
fetchAndRenderResults(trendingSeriesUrl, seriesDataContainer);

// Handle Search Form Submission
searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    const query = searchInput.value.trim();

    if (query) {
        // If the user has typed a search query, search for movies and series
        const searchMoviesUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        const searchSeriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

        // Fetch and display search results
        fetchAndRenderResults(searchMoviesUrl, movieDataContainer);
        fetchAndRenderResults(searchSeriesUrl, seriesDataContainer);
    } else {
        // If the query is empty, display random movies instead
        alert("Showing random movies...");
        
        // Fetch and display random movies (for example, fetching popular movies)
        const randomMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
        fetchAndRenderResults(randomMoviesUrl, movieDataContainer);

        // You can also fetch random TV series in a similar way
        const randomSeriesUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`;
        fetchAndRenderResults(randomSeriesUrl, seriesDataContainer);
    }
});

