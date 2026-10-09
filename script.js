// 1. Data Source (With Categories added)
const imagesData = [
    { id: 1, src: "https://picsum.photos/id/10/800/600", alt: "Mountain landscape", caption: "Majestic Mountains", category: "nature" },
    { id: 2, src: "https://picsum.photos/id/11/800/600", alt: "Ocean waves", caption: "Ocean Breeze", category: "nature" },
    { id: 3, src: "https://picsum.photos/id/12/800/600", alt: "City skyline", caption: "Urban Jungle", category: "city" },
    { id: 4, src: "https://picsum.photos/id/13/800/600", alt: "Forest trees", caption: "Deep Forest", category: "nature" },
    { id: 5, src: "https://picsum.photos/id/14/800/600", alt: "Desert dunes", caption: "Golden Sands", category: "nature" },
    { id: 6, src: "https://picsum.photos/id/15/800/600", alt: "Waterfall", caption: "Cascading Water", category: "nature" },
    { id: 7, src: "https://picsum.photos/id/16/800/600", alt: "Autumn leaves", caption: "Fall Colors", category: "nature" },
    { id: 8, src: "https://picsum.photos/id/17/800/600", alt: "Starry night", caption: "Cosmic Wonders", category: "nature" },
    { id: 9, src: "https://picsum.photos/id/18/800/600", alt: "Green valley", caption: "Lush Valley", category: "nature" },
    { id: 10, src: "https://picsum.photos/id/19/800/600", alt: "Wildlife animal", caption: "Wild Beauty", category: "animals" },
    { id: 11, src: "https://picsum.photos/id/20/800/600", alt: "Modern architecture", caption: "Structural Design", category: "city" },
    { id: 12, src: "https://picsum.photos/id/21/800/600", alt: "Snowy path", caption: "Winter Walk", category: "nature" },
    { id: 13, src: "https://picsum.photos/id/22/800/600", alt: "Calm lake", caption: "Serene Waters", category: "nature" },
    { id: 14, src: "https://picsum.photos/id/23/800/600", alt: "Colorful flowers", caption: "Spring Bloom", category: "nature" },
    { id: 15, src: "https://picsum.photos/id/24/800/600", alt: "Old book", caption: "Knowledge", category: "objects" },
    { id: 16, src: "https://picsum.photos/id/25/800/600", alt: "Coffee cup", caption: "Morning Brew", category: "objects" },
    { id: 17, src: "https://picsum.photos/id/26/800/600", alt: "Bridge over river", caption: "Crossing Paths", category: "city" },
    { id: 18, src: "https://picsum.photos/id/27/800/600", alt: "Sunset silhouette", caption: "Golden Hour", category: "nature" },
    { id: 19, src: "https://picsum.photos/id/28/800/600", alt: "Rocky cliff", caption: "Edge of the World", category: "nature" },
    { id: 20, src: "https://picsum.photos/id/29/800/600", alt: "Misty morning", caption: "Foggy Mornings", category: "nature" }
];

// 2. DOM Elements
const galleryContainer = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCounter = document.getElementById('lightbox-counter');
const closeBtn = document.getElementById('close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const categoryBtns = document.querySelectorAll('.cat-btn');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');
const playBtn = document.getElementById('play-btn');
const loadMoreBtn = document.getElementById('load-more-btn');

let currentImageIndex = 0;
let filteredImages = [...imagesData];
let previousActiveElement = null;
let favorites = JSON.parse(localStorage.getItem('galleryFavorites')) || []; // NEW
let visibleCount = 8; // NEW: Kitni images pehle dikhengi
let slideInterval; // NEW
let isPlaying = false; // NEW

// 3. Render Gallery with Skeleton Loading
function renderGallery(images) {
    galleryContainer.innerHTML = ''; 
    const fragment = document.createDocumentFragment();
    
    // NEW: Sirf visibleCount images render karein
    const imagesToRender = images.slice(0, visibleCount);
    
    imagesToRender.forEach((image) => {
        const item = document.createElement('div');
        item.classList.add('gallery-item', 'loading');
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.dataset.id = image.id;

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        img.loading = 'lazy';
        img.onload = () => item.classList.remove('loading');

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.innerHTML = `<h3>${image.caption}</h3>`;

        // NEW: Heart Icon
        const heartBtn = document.createElement('button');
        heartBtn.classList.add('heart-icon');
        heartBtn.innerHTML = '❤';
        heartBtn.setAttribute('aria-label', 'Add to favorites');
        if (favorites.includes(image.id)) {
            heartBtn.classList.add('active');
        }
        
        // Heart click event
        heartBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent lightbox from opening
            toggleFavorite(image.id, heartBtn);
        });

        item.appendChild(heartBtn);
        item.appendChild(img);
        item.appendChild(overlay);
        fragment.appendChild(item);
    });

    galleryContainer.appendChild(fragment);

    // Load More Button Visibility
    if (visibleCount >= images.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }

    // Fade-in Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gallery-item').forEach(item => observer.observe(item));
}
// NEW: Toggle Favorite
function toggleFavorite(id, btnElement) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id); // Remove
        btnElement.classList.remove('active');
    } else {
        favorites.push(id); // Add
        btnElement.classList.add('active');
    }
    localStorage.setItem('galleryFavorites', JSON.stringify(favorites)); // Save to browser
}

// 4. Lightbox Functions (With Download & Share)
function openLightbox(id) {
    const index = filteredImages.findIndex(img => img.id === id);
    if (index === -1) return;
    
    currentImageIndex = index;
    previousActiveElement = document.activeElement;
    updateLightboxContent();
    
    lightbox.hidden = false;
    requestAnimationFrame(() => {
        lightbox.classList.add('active');
        document.body.classList.add('modal-open');
    });
    closeBtn.focus();
}

function updateLightboxContent() {
    const imageData = filteredImages[currentImageIndex];
    lightboxImg.src = imageData.src;
    lightboxImg.alt = imageData.alt;
    lightboxCaption.textContent = imageData.caption;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${filteredImages.length}`;
    
    // Update Download Link
    downloadBtn.href = imageData.src;
    downloadBtn.download = `${imageData.caption.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    
    // Update Share Data
    shareBtn.dataset.url = imageData.src;
    shareBtn.dataset.title = imageData.caption;
}

function closeLightbox() {
    if (isPlaying) toggleSlideshow();
    lightbox.classList.remove('active');
    document.body.classList.remove('modal-open');
    lightbox.addEventListener('transitionend', function handler() {
        lightbox.hidden = true;
        lightbox.removeEventListener('transitionend', handler);
    }, { once: true });
    if (previousActiveElement) previousActiveElement.focus();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
    updateLightboxContent();
}

// NEW: Slideshow Functions
function toggleSlideshow() {
    if (isPlaying) {
        clearInterval(slideInterval);
        playBtn.textContent = '▶️';
        isPlaying = false;
    } else {
        slideInterval = setInterval(showNextImage, 3000); // 3 seconds
        playBtn.textContent = '⏸️';
        isPlaying = true;
    }
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    updateLightboxContent();
}

// 5. Category Filter Logic
categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // UI Update
        categoryBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter Data
        const category = e.target.dataset.category;
                if (category === 'all') {
            filteredImages = [...imagesData];
        } else if (category === 'favorites') {
            filteredImages = imagesData.filter(img => favorites.includes(img.id));
        } else {
            filteredImages = imagesData.filter(img => img.category === category);
        }
        visibleCount = 8; // Reset load more
        
        // Reset search bar and render
        searchInput.value = '';
        renderGallery(filteredImages);
    });
});

// 6. Event Listeners
galleryContainer.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) openLightbox(parseInt(item.dataset.id));
});

galleryContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const item = e.target.closest('.gallery-item');
        if (item) { e.preventDefault(); openLightbox(parseInt(item.dataset.id)); }
    }
});

closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNextImage);
prevBtn.addEventListener('click', showPrevImage);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    // Reset category UI when searching
    categoryBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-category="all"]').classList.add('active');
    
    filteredImages = imagesData.filter(img => 
        img.caption.toLowerCase().includes(query) || 
        img.alt.toLowerCase().includes(query)
    );
    
    visibleCount = 8; // <--- YEH NAYI LINE HAI (Search karne par load more reset ho jayega)
    renderGallery(filteredImages);
});

// Share Button Logic (Web Share API)
shareBtn.addEventListener('click', async () => {
    const url = shareBtn.dataset.url;
    const title = shareBtn.dataset.title;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: `Check out this beautiful image: ${title}`,
                url: url
            });
        } catch (err) {
            console.log('Share canceled or failed', err);
        }
    } else {
        // Fallback for desktop browsers that don't support Web Share API
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
});

// NEW: Load More Event
loadMoreBtn.addEventListener('click', () => {
    visibleCount += 8; // Add 8 more
    renderGallery(filteredImages);
});

// NEW: Play Button Event
playBtn.addEventListener('click', toggleSlideshow);

// Initialize
renderGallery(filteredImages);
