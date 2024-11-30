const apiKey = '5311371d6c5f1bf83718e50f58f8f076';
const movieDataContainer = document.getElementById("movie-list");
const seriesDataContainer = document.getElementById("series-list");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Default Trending Movies API
const trendingMoviesUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;

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
                    <div class="col-md-4 col-sm-6 col-lg-3 col-xl-2">
                        <img src="https://image.tmdb.org/t/p/original/${item.poster_path}" alt="${title}">
                        <a href="/watch.html?id=${item.id}" data-bs-theme="dark">
                            ${title}
                        </a>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            container.innerHTML = `<p class="text-danger">Failed to load data. Please try again.</p>`;
        });
};

// Load Default Trending Movies
fetchAndRenderResults(trendingMoviesUrl, movieDataContainer);

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
