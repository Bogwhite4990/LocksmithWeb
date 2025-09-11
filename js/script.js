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

});
