document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('is-active');
        });
    }

    // Fade-in elements on scroll
    const fadeInElements = document.querySelectorAll('.fade-in-element');

    if (fadeInElements.length > 0) {
        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeInElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Testimonial Slider
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const slides = document.querySelector('.testimonial-slides');
        const slideCount = slides.children.length;
        let slideIndex = 0;

        function showSlides() {
            const slideWidth = slides.children[0].getBoundingClientRect().width;
            slides.style.transform = `translateX(-${slideIndex * slideWidth * 3}px)`;
        }

        function nextSlide() {
            slideIndex++;
            if (slideIndex >= Math.ceil(slideCount / 3)) {
                slideIndex = 0;
            }
            showSlides();
        }

        setInterval(nextSlide, 5000); // Autoplay every 5 seconds
        window.addEventListener('resize', showSlides);
    }
});
