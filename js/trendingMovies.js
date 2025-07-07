
// --- Global state variables ---
let currentType = 'movies'; // 'movies' or 'series'
let currentPage = 1;
const itemsPerPage = 18; // Global setting for main popular movies list
let currentGenreFilter = null;

// --- DOM elements ---
const itemListContainer = document.getElementById('popular-movies-container');
const trendingListContainer = document.getElementById('trending-movies-container'); // This is for the section on detail page
// IMPORTANT: relatedListContainer from HTML seems to be missing.
// We'll assume the one inside itemDetailContent needs to be dynamically populated
const paginationControls = document.getElementById('pagination-controls');
const moviesLink = document.getElementById('movies-link');
const seriesLink = document.getElementById('series-link');
const itemListSection = document.getElementById('item-list-section');
const itemDetailSection = document.getElementById('item-detail-section');
const itemDetailContent = document.getElementById('item-detail-content');
const backToListBtn = document.getElementById('back-to-list'); // Used for 'Back to home' from detail page
const backToHomeNavBtn = document.getElementById('back-to-home-nav-btn'); // For the nav link 'Back to home'

// Utility function to create a movie card HTML
function createMovieCardHTML(item) {
    return `
        <img src="${item.image}" alt="${item.title}">
        <h6>${item.title}</h6>
        ${item.duration ? `<p>${item.duration} mins</p>` : ''}
        ${item.year ? `<p>${item.year}</p>` : ''}
    `;
}

// Function to render Popular Movies (MAIN PAGINATED LIST)
function renderPopularMovies() {
    itemListContainer.innerHTML = ''; // Clear previous items

    let itemsToDisplay = data[currentType];

    if (currentGenreFilter) {
        itemsToDisplay = itemsToDisplay.filter(item =>
            item.genre && item.genre.includes(currentGenreFilter)
        );
    }
    const reverseItems=itemsToDisplay.slice().reverse();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = reverseItems.slice(startIndex, endIndex);

    // Handle case where current page might be empty after filter/pagination
    if (paginatedItems.length === 0 && currentPage > 1) {
        currentPage = 1;
        renderPopularMovies(); // Recurse to re-render from page 1
        return;
    }

    paginatedItems.forEach(item => {
        const itemCardLink = document.createElement('a');
        itemCardLink.classList.add('movie-card');
        itemCardLink.setAttribute('href', '#');
        itemCardLink.dataset.id = item.id;
        itemCardLink.dataset.type = currentType;
        itemCardLink.innerHTML = createMovieCardHTML(item);
        itemListContainer.appendChild(itemCardLink);
    });

    // THIS IS THE ONLY PLACE renderPagination() should be called for the main list
    renderPagination(reverseItems.length, itemsPerPage);
    addCardLinkListeners();
}


// Function to render Trending Movies (NON-PAGINATED, fixed number)
function renderTrendingMovies() {
    // This function should render movies into the trendingListContainer
    // It should NOT affect main pagination
    trendingListContainer.innerHTML = ''; // Clear previous items

    const itemsToDisplay = data[currentType];
    const itemsPerTrendingSection = 6; // Fixed number for trending section


    itemsToDisplay.forEach(item => {
        const itemCardLink = document.createElement('a');
        itemCardLink.classList.add('movie-card');
        itemCardLink.setAttribute('href', '#');
        itemCardLink.dataset.id = item.id;
        itemCardLink.dataset.type = currentType;
        itemCardLink.innerHTML = createMovieCardHTML(item);
        trendingListContainer.appendChild(itemCardLink);
    });
    addCardLinkListeners(); // Add listeners for these cards too
}

// Function to render Related Movies (NON-PAGINATED, fixed number, takes genre for filtering)
// This will be called from showItemDetail
function renderRelatedMovies(targetGenre = null, currentItemId = null) {
    // Select the container dynamically as it's part of itemDetailContent
    const dynamicRelatedContainer = document.getElementById('related-movies-container-dynamic');
    if (!dynamicRelatedContainer) return; // Exit if container not found

    dynamicRelatedContainer.innerHTML = ''; // Clear previous items

    let possibleRelatedItems = data[currentType];

    // Filter by genre if a targetGenre is provided
    if (targetGenre) {
        possibleRelatedItems = possibleRelatedItems.filter(item =>
            item.genre && item.genre.includes(targetGenre) && item.id !== currentItemId
        );
    } else if (currentItemId) { // If no genre, just exclude the current item
        possibleRelatedItems = possibleRelatedItems.filter(item => item.id !== currentItemId);
    }

    // Shuffle and take a fixed number of related items
    // (Simple shuffle for demonstration, consider better related logic for production)
    const shuffledItems = possibleRelatedItems.sort(() => 0.5 - Math.random());
    const itemsPerRelatedSection = 4; // Display 4 related movies
    const relatedItems = shuffledItems.slice(0, itemsPerRelatedSection);

    if (relatedItems.length === 0) {
        dynamicRelatedContainer.innerHTML = '<p class="text-center text-muted">No related movies found.</p>';
        return;
    }

    relatedItems.forEach(item => {
        const itemCardLink = document.createElement('a');
        itemCardLink.classList.add('movie-card');
        itemCardLink.setAttribute('href', '#');
        itemCardLink.dataset.id = item.id;
        itemCardLink.dataset.type = currentType;
        itemCardLink.innerHTML = createMovieCardHTML(item);
        dynamicRelatedContainer.appendChild(itemCardLink);
    });
    addCardLinkListeners(); // Add listeners for these cards too
}


// Function to render pagination controls
function renderPagination(totalItems, itemsPerPageCount) {
    paginationControls.innerHTML = ''; // Clear previous pagination
    const totalPages = Math.ceil(totalItems / itemsPerPageCount);

    // Only show pagination if there's more than one page
    if (totalPages <= 1) {
        return;
    }

    // --- Previous Button ---
    const prevButton = document.createElement('a');
    prevButton.textContent = '<<<';
    prevButton.classList.add('page-nav-btn');
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPopularMovies(); // Trigger re-render of popular movies
        }
    });
    paginationControls.appendChild(prevButton);

    // --- Page Number Buttons ---
    // Implement logic to show a limited number of page buttons around current page
    const maxButtonsToShow = 5; // e.g., show up to 5 page buttons
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

    // Adjust startPage if we hit the end
    if (endPage - startPage + 1 < maxButtonsToShow) {
        startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageNumLink = document.createElement('a');
        pageNumLink.textContent = i;
        pageNumLink.classList.add('page-btn');
        pageNumLink.setAttribute('href', '#');
        if (i === currentPage) {
            pageNumLink.classList.add('active');
        }
        pageNumLink.addEventListener('click', (event) => {
            event.preventDefault();
            currentPage = i;
            renderPopularMovies(); // Trigger re-render of popular movies
        });
        paginationControls.appendChild(pageNumLink);
    }

    // --- Next Button ---
    const nextButton = document.createElement('a');
    nextButton.textContent = '>>>';
    nextButton.classList.add('page-nav-btn');
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPopularMovies(); // Trigger re-render of popular movies
        }
    });
    paginationControls.appendChild(nextButton);
}


// Function to handle showing item details
function showItemDetail(id, type) {
    const item = data[type].find(item => item.id === id);
    if (!item) {
        console.error('Item not found:', id, type);
        return;
    }

    let genreHtml = 'N/A';
    if (item.genre) {
        const genres = item.genre.split(',').map(g => g.trim());
        genreHtml = genres.map(g =>
            `<a class="genre-link" data-genre="${g}">
                <span class="badge bg-secondary">${g}</span>
            </a>`
        ).join(', ');
    }

    itemDetailContent.innerHTML = `
        <div class="movie-detail-main-wrapper"> <div class="row">
                <div class="col-md-4 text-center">
                    <img src="${item.image}" class="movie-poster img-fluid rounded" alt="${item.title}" />
                </div>
                <div class="col-md-8">
                    <h2>${item.title} (${item.year || 'N/A'})</h2>
                    <p>IMDB Rating: <strong>85%</strong></p>
                    <p>Budget: <strong>$${item.budget || 'N/A'}</strong> / Revenue: <strong>$${item.revenue || 'N/A'}</strong></p>
                    <div class="mb-3">${genreHtml}</div>
                    <p>${item.review || item.description || 'No description available.'}</p>
                </div>
            </div>

            <div class="row mt-4 g-2">
                <div class="col-6 col-md-3"><img src="../images/still.jpg" class="img-fluid rounded" /></div>
                <div class="col-6 col-md-3"><img src="../images/still.jpg" class="img-fluid rounded" /></div>
                <div class="col-6 col-md-3"><img src="../images/still.jpg" class="img-fluid rounded" /></div>
                <div class="col-6 col-md-3"><img src="../images/still.jpg" class="img-fluid rounded" /></div>
            </div>

            <div class="mt-4 d-flex gap-2 flex-wrap">
                <a href="${item.watchlink || '#'}" target="_blank" class="btn btn-danger">Watch Now</a>
                <a href="${item["720pLink"] || '#'}" target="_blank" class="btn btn-outline-light">Download 720p</a>
                <a href="${item["1080pLink"] || '#'}" target="_blank" class="btn btn-outline-light">Download 1080p</a>
                <a href="#" class="btn btn-outline-warning">How to download?</a>
            </div>

    `;

    itemListSection.classList.add('hidden');
    itemDetailSection.classList.remove('hidden');

    addGenreLinkListeners();
    // Render related movies specific to THIS detail page
    renderRelatedMovies(item.genre ? item.genre.split(',')[0].trim() : null, item.id); // Pass the first genre for related
}

// Function to attach click listeners to cards
function addCardLinkListeners() {
    document.querySelectorAll('a.movie-card').forEach(linkElement => {
        linkElement.removeEventListener('click', handleCardLinkClick);
        linkElement.addEventListener('click', handleCardLinkClick);
    });
}

function handleCardLinkClick(event) {
    event.preventDefault();
    const itemId = event.currentTarget.dataset.id;
    const itemType = event.currentTarget.dataset.type;
    showItemDetail(itemId, itemType);
}

function addGenreLinkListeners() {
    document.querySelectorAll('.genre-link').forEach(genreLink => { // Changed variable name to genreLink
        genreLink.removeEventListener('click', handleGenreLinkClick);
        genreLink.addEventListener('click', handleGenreLinkClick);
    });
}

function handleGenreLinkClick(event) {
    event.preventDefault(); // Prevent default link behavior
    const genre = event.currentTarget.dataset.genre;
    currentGenreFilter = genre;
    currentPage = 1; // Reset page when filtering by genre
    renderPopularMovies(); // Re-render the main popular list with filter
    renderTrendingMovies(); // Re-render trending as well, if it's on the home page
    itemDetailSection.classList.add('hidden'); // Go back to list view
    itemListSection.classList.remove('hidden');
    console.log(`Filtering by genre: ${genre}`);
}

// --- Event Listeners for main navigation and buttons ---
moviesLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    currentType = 'movies';
    currentPage = 1;
    currentGenreFilter = null; // Clear filter when changing category
    moviesLink.classList.add('active');
    seriesLink.classList.remove('active');
    renderPopularMovies(); // Only render popular movies, which will also render pagination
    renderTrendingMovies(); // Render trending section
    // renderRelatedMovies() should only be called on detail page, not here.
});

seriesLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    currentType = 'series';
    currentPage = 1;
    currentGenreFilter = null; // Clear filter when changing category
    seriesLink.classList.add('active');
    moviesLink.classList.remove('active');
    renderPopularMovies(); // Only render popular movies, which will also render pagination
    renderTrendingMovies(); // Render trending section
    // renderRelatedMovies() should only be called on detail page, not here.
});

// Assuming backToListBtn is the one inside #item-list-section (the hidden one)
backToListBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    itemDetailSection.classList.add('hidden');
    itemListSection.classList.remove('hidden');
    currentGenreFilter = null; // Clear genre filter when going back to list
    currentPage = 1; // Reset to page 1
    renderPopularMovies(); // Re-render without genre filter and update pagination
    renderTrendingMovies(); // Render trending section
});

// Assuming backToHomeNavBtn is the one in the #item-detail-section
const backToHomeDetailBtn = document.getElementById('back-to-home'); // Get the button by its ID
if (backToHomeDetailBtn) { // Check if it exists before adding listener
    backToHomeDetailBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        itemDetailSection.classList.add('hidden');
        itemListSection.classList.remove('hidden');
        currentGenreFilter = null; // Clear genre filter when going back to list
        currentPage = 1; // Reset to page 1
        renderPopularMovies(); // Re-render without genre filter and update pagination
        renderTrendingMovies(); // Render trending section
    });
}


// Initial render when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderPopularMovies(); // This will also call renderPagination
    renderTrendingMovies(); // Initial render for trending section
    // renderRelatedMovies is only called when showItemDetail is invoked
});