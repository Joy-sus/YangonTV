// --- Global state variables for genre.html ---
let currentGenreFilter = null;
let currentGenrePage = 1;
const genreItemsPerPage = 18; // You can adjust this for the genre page

// --- DOM elements for genre.html ---
const genreFilterButtonsContainer = document.getElementById('genre-filter-buttons-container');
const filteredGenreItemsContainer = document.getElementById('filtered-genre-items-container');
const genrePaginationControls = document.getElementById('genre-pagination-controls');
const filteredResultsTitle = document.getElementById('filtered-results-title');


// --- Utility to create movie card HTML (copied from popular.js) ---
function createMovieCardHTML(item) {
    return `
        <img src="${item.image}" alt="${item.title}"> <h6>${item.title}</h6>
        ${item.duration ? `<p>${item.duration} mins</p>` : ''}
        ${item.year ? `<p>${item.year}</p>` : ''}
    `;
}

// --- Function to get all unique genres from all data ---
function getAllUniqueGenres() {
    const uniqueGenres = new Set();
    // Iterate through movies
    data.movies.forEach(item => {
        if (item.genre) {
            item.genre.split(',').map(g => g.trim()).forEach(g => uniqueGenres.add(g));
        }
    });
    // Iterate through series
    data.series.forEach(item => {
        if (item.genre) {
            item.genre.split(',').map(g => g.trim()).forEach(g => uniqueGenres.add(g));
        }
    });
    return Array.from(uniqueGenres).sort(); // Convert Set to Array and sort
}

// --- Function to render genre filter buttons ---
function renderGenreFilterButtons() {
    if (!genreFilterButtonsContainer) return;
    genreFilterButtonsContainer.innerHTML = ''; // Clear previous buttons

    const allGenres = getAllUniqueGenres();

    // Create an "All" button to clear filters
    const allButton = document.createElement('a');
    allButton.textContent = 'All';
    allButton.classList.add('genre-link', 'filter-genre-btn'); // Use existing badge styling
    allButton.href = '?genre='; // URL to clear filter
    if (!currentGenreFilter) {
        allButton.classList.add('active-filter-genre'); // Custom class for active filter button
    }
    genreFilterButtonsContainer.appendChild(allButton);

    allGenres.forEach(genre => {
        const genreLink = document.createElement('a');
        genreLink.textContent = genre;
        genreLink.classList.add('genre-link', 'filter-genre-btn'); // Apply badge styling
        genreLink.href = `?genre=${encodeURIComponent(genre)}`; // URL with genre parameter
        if (currentGenreFilter === genre) {
            genreLink.classList.add('active-filter-genre');
        }
        genreFilterButtonsContainer.appendChild(genreLink);
    });

    // Add event listeners to all newly created filter buttons
    addGenreFilterButtonListeners();
}

// --- Function to attach event listeners to genre filter buttons ---
function addGenreFilterButtonListeners() {
    document.querySelectorAll('.filter-genre-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            // This is crucial: Let the browser handle the navigation via href
            // We'll read the URL parameter on page load
        });
    });
}

// --- Function to render filtered movies/series ---
function renderFilteredGenreItems() {
    filteredGenreItemsContainer.innerHTML = ''; // Clear previous items

    let itemsToDisplay = [];
    // Combine movies and series for genre filtering
    const allItems = [...data.movies, ...data.series];

    if (currentGenreFilter) {
        itemsToDisplay = allItems.filter(item =>
            item.genre && item.genre.includes(currentGenreFilter)
        );
        filteredResultsTitle.textContent = `Movies & Series in "${currentGenreFilter}" Genre`;
    } else {
        itemsToDisplay = allItems; // Show all if no filter
        filteredResultsTitle.textContent = 'All Movies & Series';
    }

    // Handle pagination for filtered results
    const startIndex = (currentGenrePage - 1) * genreItemsPerPage;
    const endIndex = startIndex + genreItemsPerPage;
    const paginatedItems = itemsToDisplay.slice(startIndex, endIndex);

    if (paginatedItems.length === 0 && currentGenrePage > 1) {
        currentGenrePage = 1;
        renderFilteredGenreItems(); // Recurse to re-render from page 1
        return;
    }

    if (paginatedItems.length === 0 && currentGenreFilter) {
         filteredGenreItemsContainer.innerHTML = `<p class="text-center text-muted">No items found for the genre "${currentGenreFilter}".</p>`;
         renderGenrePagination(0, genreItemsPerPage); // Hide pagination if no items
         return;
    }


    paginatedItems.forEach(item => {
        const itemCardLink = document.createElement('a');
        itemCardLink.classList.add('movie-card');
        itemCardLink.setAttribute('href', `index.html?id=${item.id}&type=${item.type || 'movies'}`); // Link back to index.html detail
        itemCardLink.dataset.id = item.id;
        itemCardLink.dataset.type = item.type || 'movies'; // Store type (add 'type' to your data if not there)

        itemCardLink.innerHTML = createMovieCardHTML(item);
        filteredGenreItemsContainer.appendChild(itemCardLink);
    });

    renderGenrePagination(itemsToDisplay.length, genreItemsPerPage);
    addCardLinkListeners(); // Re-attach listeners for dynamically added cards
}

// --- Pagination function for genre.html ---
function renderGenrePagination(totalItems, itemsPerPageCount) {
    if (!genrePaginationControls) return;
    genrePaginationControls.innerHTML = ''; // Clear previous pagination
    const totalPages = Math.ceil(totalItems / itemsPerPageCount);

    if (totalPages <= 1) {
        return; // No pagination needed
    }

    // --- Previous Button ---
    const prevButton = document.createElement('a');
    prevButton.textContent = '<<<';
    prevButton.classList.add('page-nav-btn');
    prevButton.disabled = currentGenrePage === 1;
    prevButton.addEventListener('click', () => {
        if (currentGenrePage > 1) {
            currentGenrePage--;
            renderFilteredGenreItems();
        }
    });
    genrePaginationControls.appendChild(prevButton);

    // --- Page Number Buttons (limited display) ---
    const maxButtonsToShow = 5;
    let startPage = Math.max(1, currentGenrePage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

    if (endPage - startPage + 1 < maxButtonsToShow) {
        startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageNumLink = document.createElement('a');
        pageNumLink.textContent = i;
        pageNumLink.classList.add('page-btn');
        pageNumLink.href = `?genre=${encodeURIComponent(currentGenreFilter || '')}&page=${i}`; // Update URL with page
        if (i === currentGenrePage) {
            pageNumLink.classList.add('active');
        }
        pageNumLink.addEventListener('click', (event) => {
            // This is crucial: Let the browser handle the navigation via href
            // We'll read the URL parameter on page load
        });
        genrePaginationControls.appendChild(pageNumLink);
    }

    // --- Next Button ---
    const nextButton = document.createElement('a');
    nextButton.textContent = '>>>';
    nextButton.classList.add('page-nav-btn');
    nextButton.disabled = currentGenrePage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentGenrePage < totalPages) {
            currentGenrePage++;
            renderFilteredGenreItems();
        }
    });
    genrePaginationControls.appendChild(nextButton);
}

// --- Function to attach click listeners to movie cards (for redirecting to detail) ---
function addCardLinkListeners() {
    document.querySelectorAll('a.movie-card').forEach(linkElement => {
        linkElement.removeEventListener('click', handleCardLinkClick); // Prevent double listeners
        linkElement.addEventListener('click', handleCardLinkClick);
    });
}

function handleCardLinkClick(event) {
    // This function will now handle redirection to index.html with item details
    // The event.preventDefault() is implicitly handled by the <a> href
    // However, if you want client-side routing, you'd preventDefault and manually change the URL
    // For now, let the href handle it.
}


// --- Initialization on page load ---
document.addEventListener('DOMContentLoaded', () => {
    // Read genre and page from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentGenreFilter = urlParams.get('genre') || null;
    currentGenrePage = parseInt(urlParams.get('page')) || 1;

    renderGenreFilterButtons(); // Render the genre buttons first
    renderFilteredGenreItems(); // Then render the filtered items
});