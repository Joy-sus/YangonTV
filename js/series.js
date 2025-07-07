
let currentType = 'series'; // 'movies' or 'series'
let currentPage = 1;
const itemsPerPage = 12;
let currentGenreFilter = null; //

// DOM elements (no changes, assuming IDs match your HTML)
const itemListContainer = document.getElementById('popular-movies-container');
const popularLinkContainer=document.getElementById('popular-movies-link');
const trendingLinkContainer=document.getElementById('trending-movies-link')
const trendingListContainer = document.getElementById('trending-movies-container');
const relatedListContainer = document.getElementById('related-movies-container');
const paginationControls = document.getElementById('pagination-controls');
const moviesLink = document.getElementById('movies-link');
const seriesLink = document.getElementById('series-link');
const itemListSection = document.getElementById('item-list-section');
const itemDetailSection = document.getElementById('item-detail-section');
const itemDetailContent = document.getElementById('item-detail-content');
const backToListBtn = document.getElementById('back-to-list');
// --- DOM elements for Mobile Nav ---
const hamburgerBtn = document.getElementById('hamburger');
const mobileNav = document.getElementById('navLinks');

// --- Event Listener for Hamburger Button ---
if (hamburgerBtn && mobileNav) { // Ensure elements exist before adding listener
    hamburgerBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('show'); // Toggle the 'show' class
    });
}

// Optional: Close mobile nav if a link inside it is clicked
// This makes for a smoother mobile experience
if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('show'); // Hide the nav after clicking a link
        });
    });
}
// Function to render items (now creating <a> tags)
function renderPopularMovies() {
    itemListContainer.innerHTML = ''; // Clear previous items
    popularLinkContainer.innerHTML='';
    const itemsToDisplay = data[currentType];
    if (currentGenreFilter) {
        itemsToDisplay = itemsToDisplay.filter(item =>
            item.genre && item.genre.includes(currentGenreFilter)
        );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = itemsToDisplay.slice(startIndex, endIndex);

    if (paginatedItems.length === 0 && currentPage > 1) {
        currentPage = 1;
        renderPopularMovies();
        return;
    }
    
    paginatedItems.forEach(item => {
        // Create an <a> tag instead of a div
        const itemCardLink = document.createElement('a');
        itemCardLink.classList.add('movie-card'); // Use this class for styling the link as a card
        itemCardLink.setAttribute('href', '#'); // Set href to '#' or item.link if you want actual links
                                                // We'll prevent default behavior later.

        // Attach data attributes to the <a> tag itself
        itemCardLink.dataset.id = item.id;
        itemCardLink.dataset.type = currentType;

        itemCardLink.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h6>${item.title}</h6>
            ${item.duration ? `<p>${item.duration} mins</p>` : ''}
            ${item.year ? `<p>${item.year}</p>` : ''}
        `;
        itemListContainer.appendChild(itemCardLink); // Append the <a> tag
    });

    // renderPagination(); // Still commented out if not used
    addCardLinkListeners(); // Call the function to attach listeners to the newly created <a> tags
}

function renderTrendingMovies() {
    trendingListContainer.innerHTML = ''; // Clear previous items
    trendingLinkContainer.innerHTML='';
    const itemsToDisplay = data[currentType];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const reverseItem=itemsToDisplay.slice().reverse();
    const paginatedItems = reverseItem.slice(startIndex, endIndex);

    if (paginatedItems.length === 0 && currentPage > 1) {
        currentPage = 1;
        renderTrendingMovies();
        return;
    }
    trendingLinkContainer.innerHTML=`
            <h5>Trending ${currentType}</h5>
            <a href=" ../${currentType}/trending.html" class="red-button">See all<span class="arrow">→</span></a>`
    paginatedItems.forEach(item => {
        // Create an <a> tag instead of a div
        const itemCardLink = document.createElement('a');
        itemCardLink.classList.add('movie-card'); // Use this class for styling the link as a card
        itemCardLink.setAttribute('href', '#'); // Set href to '#' or item.link if you want actual links
                                                // We'll prevent default behavior later.

        // Attach data attributes to the <a> tag itself
        itemCardLink.dataset.id = item.id;
        itemCardLink.dataset.type = currentType;

        itemCardLink.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h6>${item.title}</h6>
            ${item.duration ? `<p>${item.duration} mins</p>` : ''}
            ${item.year ? `<p>${item.year}</p>` : ''}
        `;
        trendingListContainer.appendChild(itemCardLink); // Append the <a> tag
    });

    // renderPagination(); // Still commented out if not used
    addCardLinkListeners(); // Call the function to attach listeners to the newly created <a> tags
}

function renderPopularLink(){
    
}

function renderRelatedMovies() {
    relatedListContainer.innerHTML = ''; // Clear previous items
    popularLinkContainer.innerHTML='';
    const itemsToDisplay = data[currentType];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = itemsToDisplay.slice(startIndex, endIndex);

    if (paginatedItems.length === 0 && currentPage > 1) {
        currentPage = 1;
        renderRelatedMovies();
        return;
    }
    popularLinkContainer.innerHTML=`
            <h5>Popular ${currentType}</h5>
            <a href=" ../${currentType}/popular.html" class="red-button">See all<span class="arrow">→</span></a>`
    paginatedItems.forEach(item => {
        // Create an <a> tag instead of a div
        const itemCardLink = document.createElement('a');
        itemCardLink.classList.add('movie-card'); // Use this class for styling the link as a card
        itemCardLink.setAttribute('href', '#'); // Set href to '#' or item.link if you want actual links
                                                // We'll prevent default behavior later.

        // Attach data attributes to the <a> tag itself
        itemCardLink.dataset.id = item.id;
        itemCardLink.dataset.type = currentType;

        itemCardLink.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h6>${item.title}</h6>
            ${item.duration ? `<p>${item.duration} mins</p>` : ''}
            ${item.year ? `<p>${item.year}</p>` : ''}
        `;
        relatedListContainer.appendChild(itemCardLink); // Append the <a> tag
    });

    // renderPagination(); // Still commented out if not used
    addCardLinkListeners(); // Call the function to attach listeners to the newly created <a> tags
}

// Function to handle showing item details (no changes)
function showItemDetail(id, type) {
    const item = data[type].find(item => item.id === id);
    if (!item) {
        console.error('Item not found:', id, type);
        return;
    }

    let genreHtml = 'N/A';
    if (item.genre) {
        // Split the genre string by comma and trim whitespace, then map to links
        const genres = item.genre.split(',').map(g => g.trim());
        genreHtml = genres.map(g =>
            `<a class="genre-link" data-genre="${g}"><span class="badge bg-secondary">${g}</span></a>`
        ).join(', '); // Join them back with commas and spaces
    }

    itemDetailContent.innerHTML = `
        ${type === 'movies' ? `
<div class="movie-container">
  <div class="row">
    <div class="col-md-4 text-center">
      <img src="${item.image}" class="movie-poster" alt="${item.title}" />
    </div>
    <div class="col-md-8">
      <h2>${item.title}(${item.year})</h2>
      <p>IMDB Rating: <strong>85%</strong></p>
      <p>Budget: <strong>$${item.budget}</strong> / Revenue: <strong>$${item.revenue}</strong></p>
      <div class="mb-3">
${genreHtml}
      </div>
      <p>${item.review}</p>
    </div>
  </div>

  <div class="row mt-4 g-2">
    <div class="col-6 col-md-3"><img src="images/still.jpg" class="img-fluid rounded" /></div>
    <div class="col-6 col-md-3"><img src="images/still.jpg" class="img-fluid rounded" /></div>
    <div class="col-6 col-md-3"><img src="images/still.jpg" class="img-fluid rounded" /></div>
    <div class="col-6 col-md-3"><img src="images/still.jpg" class="img-fluid rounded" /></div>
  </div>

  <div class="mt-4 d-flex gap-2 flex-wrap">
    <a href="#" class="btn btn-danger">Watch Now</a>
    <a href="#" class="btn btn-outline-light">Download 720p</a>
    <a href="#" class="btn btn-outline-light">Download 1080p</a>
    <a href="#" class="btn btn-outline-warning">How to download?</a>
  </div>
  <p></p>
  <p></p>

      <div class="d-flex justify-content-between align-items-center pb-3">
        <h5>Related Movies</h5>
        <button class="red-button">See all<span class="arrow">→</span></button>
      </div>

        ` : `

<div class="movie-container">
  <div class="row">
    <div class="col-md-4 text-center">
      <img src="${item.image}" class="movie-poster" alt="${item.title}" />
    </div>
    <div class="col-md-8">
      <h2>${item.title}(${item.year})</h2>
      <p>IMDB Rating: <strong>85%</strong></p>
      <p>Budget: <strong>$${item.budget}</strong> / Revenue: <strong>$${item.revenue}</strong></p>
      <div class="mb-3">
${genreHtml}
      </div>
      <p>${item.review}</p>
    </div>
  </div>

  <div class="row mt-4 g-2">
    <div class="col-6 col-md-3"><img src="images/still.jpg" class="img-fluid rounded" /></div>
    <div class="col-6 col-md-3"><img src="images/still.jpg" class="img-fluid rounded" /></div>
    <div class="col-6 col-md-3"><img src="images/still.jpg" class="img-fluid rounded" /></div>
    <div class="col-6 col-md-3"><img src="images/still.jpg" class="img-fluid rounded" /></div>
  </div>

  <div class="mt-4 d-flex gap-2 flex-wrap">
    <a href="#" class="btn btn-danger">Watch Now</a>
    <a href="#" class="btn btn-outline-light">Download 720p</a>
    <a href="#" class="btn btn-outline-light">Download 1080p</a>
    <a href="#" class="btn btn-outline-warning">How to download?</a>
  </div>
  <p></p>
  <p></p>

      <div class="d-flex justify-content-between align-items-center pb-3">
        <h5>Related Series</h5>
        <button class="red-button">See all<span class="arrow">→</span></button>
      </div>

            
        `}
    `;

    itemListSection.classList.add('hidden');
    itemDetailSection.classList.remove('hidden');
    addGenreLinkListeners();    
}

// Function to attach event listeners to clickable <a> tags (renamed and modified)
function addCardLinkListeners() {
    // Select all <a> tags that have the 'movie-card' class
    document.querySelectorAll('a.movie-card').forEach(linkElement => {
        // Remove existing listener to prevent duplicates
        linkElement.removeEventListener('click', handleCardLinkClick);
        // Add new listener
        linkElement.addEventListener('click', handleCardLinkClick);
    });
}

// Separate handler function for link clicks
function handleCardLinkClick(event) {
    event.preventDefault(); // IMPORTANT: Prevent the default link behavior (navigating to '#')
    const itemId = event.currentTarget.dataset.id;
    const itemType = event.currentTarget.dataset.type;
    showItemDetail(itemId, itemType);
}

function addGenreLinkListeners() {
    document.querySelectorAll('.genre-link').forEach(genreButton => {
        // Ensure only one listener is added
        genreButton.removeEventListener('click', handleGenreLinkClick);
        genreButton.addEventListener('click', handleGenreLinkClick);
    });
}

function handleGenreLinkClick(event) {
    const genre = event.currentTarget.dataset.genre;
    currentGenreFilter = genre; // Set the global filter
    currentPage = 1;            // Reset to page 1 for the new filter
    renderPopularMovies();      // Re-render items with the new filter applied

    // Switch back to the list view if currently in detail view
    itemDetailSection.classList.add('hidden');
    itemListSection.classList.remove('hidden');
    console.log(`Filtering by genre: ${genre}`);
}

// Event Listeners for category links (no changes)
moviesLink.addEventListener('click', () => {
    currentType = 'movies';
    currentPage = 1;
    currentGenreFilter = null; 
    moviesLink.classList.add('active');
    seriesLink.classList.remove('active');
    renderPopularMovies();
    renderTrendingMovies();
    renderRelatedMovies();    
});

seriesLink.addEventListener('click', () => {
    currentType = 'series';
    currentPage = 1;
    currentGenreFilter = null;     
    seriesLink.classList.add('active');
    moviesLink.classList.remove('active');
    renderPopularMovies();
    renderTrendingMovies();
    renderRelatedMovies();
});

// Event Listener for "Back to List" button (no changes)
backToListBtn.addEventListener('click', () => {
    itemDetailSection.classList.add('hidden');
    itemListSection.classList.remove('hidden');
    currentGenreFilter = null; 
    renderPopularMovies();
    renderTrendingMovies();
    renderRelatedMovies();       
});

// Initial render (no changes)
document.addEventListener('DOMContentLoaded', () => {
    renderPopularMovies();
    renderTrendingMovies();
    renderRelatedMovies();
});