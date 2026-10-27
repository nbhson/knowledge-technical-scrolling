let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let isScrolling = false;

window.addEventListener('wheel', (e) => {
    // Prevent default scroll behavior
    // Note: { passive: false } is required to use preventDefault on wheel listener
    e.preventDefault(); 
    
    if (isScrolling) return;

    if (e.deltaY > 0) {
        // Scrolling Down
        if (currentSlide < totalSlides - 1) {
            scrollToSlide(currentSlide + 1);
        }
    } else {
        // Scrolling Up
        if (currentSlide > 0) {
            scrollToSlide(currentSlide - 1);
        }
    }
}, { passive: false });

function scrollToSlide(index) {
    isScrolling = true;
    currentSlide = index;
    
    // Move all slides up/down
    slides.forEach((slide, i) => {
        const offset = (i - currentSlide) * 100;
        slide.style.transform = `translateY(${offset}%)`;
    });

    updateProgressBar();

    // Reset scrolling flag after transition finishes (matches CSS transition time)
    setTimeout(() => {
        isScrolling = false;
    }, 1000); 
}

function updateProgressBar() {
    const progress = (currentSlide / (totalSlides - 1)) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// Initialize positions
scrollToSlide(0);
