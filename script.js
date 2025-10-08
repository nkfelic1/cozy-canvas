// array of pin data
const pinData = [
    { src: 'img/1.jpg', description: 'Pin 1' },
    { src: 'img/2.jpg', description: 'Pin 2' },
    { src: 'img/3.jpg', description: 'Pin 3' },
    { src: 'img/pom1.jpg', description: 'Pin pom1' },
    { src: 'img/4.jpg', description: 'Pin 4' },
    { src: 'img/5.jpg', description: 'Pin 5' },
    { src: 'img/6.jpg', description: 'Pin 6' },
    { src: 'img/pom2.jpg', description: 'Pin pom2' },
    { src: 'img/7.jpg', description: 'Pin 7' },
    { src: 'img/8.jpg', description: 'Pin 8' },
    { src: 'img/9.jpg', description: 'Pin 9' },
    { src: 'img/pom3.jpg', description: 'Pin pom3' },
    { src: 'img/10.jpg', description: 'Pin 10' },
    { src: 'img/11.jpg', description: 'Pin 11' },
    { src: 'img/12.jpg', description: 'Pin 12' },
    { src: 'img/pom4.jpg', description: 'Pin pom4' },
    { src: 'img/13.jpg', description: 'Pin 13' },
    { src: 'img/14.jpg', description: 'Pin 14' },
    { src: 'img/15.jpg', description: 'Pin 15' },
    { src: 'img/pom5.jpg', description: 'Pin pom5' },
    { src: 'img/16.jpg', description: 'Pin 16' },
    { src: 'img/17.jpg', description: 'Pin 17' },
    { src: 'img/18.jpg', description: 'Pin 18' },
    { src: 'img/pom6.jpg', description: 'Pin pom6' },
    { src: 'img/19.jpg', description: 'Pin 19' },
    { src: 'img/20.jpg', description: 'Pin 20' },
    { src: 'img/21.jpg', description: 'Pin 21' },
    { src: 'img/pom7.jpg', description: 'Pin pom7' },
    { src: 'img/22.jpg', description: 'Pin 22' },
    { src: 'img/23.jpg', description: 'Pin 23' },
    { src: 'img/24.jpg', description: 'Pin 24' },
    { src: 'img/25.jpg', description: 'Pin 25' }
]

// Number of columns for the masonry grid
const NUM_COLUMNS = 4;

// Get the masonry grid container
const masonryContainer = document.getElementById('masonry-container');

// Responsive column count based on window width
function getResponsiveColumnCount() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 900) return 2;
    if (window.innerWidth < 1200) return 3;
    return 4;
}

// Array to store references to the columns
let gridColumns = [];

// Remove all child nodes from a parent
function clearElement(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
}

// Dynamically create and append columns
function setupColumnsAndReflowPins() {
    const colCount = getResponsiveColumnCount();
    clearElement(masonryContainer);
    gridColumns = [];
    for (let i = 0; i < colCount; i++) {
        const col = document.createElement('div');
        col.className = 'grid-column';
        masonryContainer.appendChild(col);
        gridColumns.push(col);
    }
    // Reflow already loaded pins
    document.querySelectorAll('.pin').forEach(pin => {
        // Remove pin from old column and append to shortest new column
        const shortestCol = findShortestColumn();
        shortestCol.appendChild(pin);
    });
}

/**
 * Find the grid-column element with the minimum height.
 * @returns {HTMLElement} The shortest column element.
 */
function findShortestColumn() {
    let minHeight = Infinity;
    let shortestCol = null;
    for (const col of gridColumns) {
        const colHeight = col.offsetHeight;
        if (colHeight < minHeight) {
            minHeight = colHeight;
            shortestCol = col;
        }
    }
    return shortestCol;
}

/**
 * Append a pin element to the specified column.
 * @param {HTMLElement} pinEl - The pin HTML element.
 * @param {HTMLElement} column - The column to append to.
 */
function appendPinToColumn(pinEl, column) {
    column.appendChild(pinEl);
}

/**
 * Pin placement logic: create a pin element and append to the shortest column.
 */
function placePin(pin) {
    const template = document.getElementById('pin-template');
    const pinClone = template.content.cloneNode(true);
    const img = pinClone.querySelector('.pin-image');
    img.setAttribute('data-src', pin.src);
    img.alt = pin.description;
    // Optionally set description or other fields here

    const shortestCol = findShortestColumn();
    appendPinToColumn(pinClone, shortestCol);

    // Observe the image for lazy loading
    observer.observe(shortestCol.lastElementChild.querySelector('.pin-image'));
}

// Intersection Observer for lazy loading images
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            obs.unobserve(img);
        }
    });
});

// Track the index of the next pin to load
let nextPinIndex = 0;
// Number of pins to load per batch
const PINS_PER_BATCH = 10;

/**
 * Load the next batch of pins.
 */
function loadMorePins() {
    const end = Math.min(nextPinIndex + PINS_PER_BATCH, pinData.length);
    for (let i = nextPinIndex; i < end; i++) {
        placePin(pinData[i]);
    }
    nextPinIndex = end;
}

/**
 * Check if more pins can be loaded.
 * @returns {boolean}
 */
function canLoadMorePins() {
    return nextPinIndex < pinData.length;
}

// Call loadMorePins for the initial batch after DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    setupColumnsAndReflowPins();
    loadMorePins();
});

// Recalculate columns and reflow pins on resize
window.addEventListener('resize', () => {
    setupColumnsAndReflowPins();
});

// Listen for scroll events to load more pins near the bottom
window.addEventListener('scroll', () => {
    const buffer = 100; // px before reaching bottom
    const scrollPosition = window.innerHeight + window.scrollY;
    const triggerPoint = document.body.offsetHeight - buffer;
    if (scrollPosition >= triggerPoint && canLoadMorePins()) {
        loadMorePins();
    }
});
