const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const encodedWatchId = encodeURIComponent(watch_id);

const player = document.getElementById('watch-movie')
player.innerHTML = `<iframe src="https://vidsrc.cc/v2/embed/movie/${encodedWatchId}?autoPlay=false" frameborder="0" width="100%" height="500" allowfullscreen></iframe>`;