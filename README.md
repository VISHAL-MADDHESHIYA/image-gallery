# 🖼️ Image Gallery 

A responsive, feature-rich, and accessible Image Gallery built entirely using Vanilla HTML, CSS, and JavaScript. This project was developed as part of the **Web Development Internship**.

## 🚀 Live Demo
*   **Live Link:** [Insert your Vercel/Netlify/GitHub Pages link here]
*   **GitHub Repo:** [Insert your GitHub repository link here]

---

## ✨ Features
This project goes beyond the basic requirements of a simple gallery. It includes:

*   **Responsive CSS Grid:** Uses `repeat(auto-fit, minmax())` for a fluid layout that adapts to any screen size without media queries.
*   **Interactive Lightbox Modal:** Click any image to view it in a high-resolution modal.
*   **Full Keyboard Navigation:** Use `ArrowLeft` / `ArrowRight` to navigate images, and `Escape` to close the modal.
*   **Dark/Light Mode:** A seamless theme toggle with CSS Variables that remembers the user's preference.
*   **Real-Time Search:** Filter images by caption or alt text instantly as you type.
*   **Category Filters:** Easily sort images by *Nature, City, Animals, Objects*, or view your liked *Favorites*.
*   **Favorites System (LocalStorage):** Click the heart icon to like an image. Liked images are saved in the browser's local storage and persist even after a page refresh.
*   **Slideshow / Autoplay:** Play a slideshow in the lightbox that automatically changes images every 3 seconds.
*   **Load More Pagination:** Displays 8 images initially and appends more via a "Load More" button to ensure fast initial load times.
*   **Download & Share:** Direct download button for images, and a native Web Share API button (which falls back to copying the URL to clipboard on desktop).
*   **Skeleton Loading & Animations:** Shimmer effects while images load, smooth fade-in scroll animations via Intersection Observer, and glassmorphism UI.
*   **Fully Accessible (A11y):** Focus trapping in modal, focus restoration, `aria-labels`, and semantic HTML.

---

## 🛠️ Tech Stack
*   **HTML5:** Semantic structure & accessibility attributes.
*   **CSS3:** CSS Variables (Theming), CSS Grid, Flexbox, Keyframe animations, Glassmorphism.
*   **JavaScript (ES6+):** DOM Manipulation, Event Delegation, LocalStorage API, Web Share API, Intersection Observer API.

---

## 📁 Folder Structure
```text
advanced-image-gallery/
│
├── index.html          # Main HTML structure
├── README.md           # Project documentation
│
├── style.css           # All styling and animations
│
│
└── script.js           # Application logic and API integrations