document.addEventListener('DOMContentLoaded', function() {
    // Apply global site configuration
    if (window.siteConfig) {
        const cfg = window.siteConfig;

        document.querySelectorAll('[data-site-name]').forEach(el => {
            el.textContent = cfg.siteName;
        });

        document.querySelectorAll('[data-phone]').forEach(el => {
            el.textContent = cfg.phone;
            if (el.tagName === 'A') {
                el.setAttribute('href', `tel:${cfg.phone}`);
            }
        });

        document.querySelectorAll('[data-email]').forEach(el => {
            el.textContent = cfg.email;
            if (el.tagName === 'A') {
                el.setAttribute('href', `mailto:${cfg.email}`);
            }
        });

        document.querySelectorAll('[data-address]').forEach(el => {
            el.textContent = cfg.address;
        });

        document.querySelectorAll('script[type="application/ld+json"]').forEach(tag => {
            try {
                const data = JSON.parse(tag.textContent);
                if (cfg.siteName) data.name = cfg.siteName;
                if (cfg.phone) data.telephone = cfg.phone;
                if (cfg.email) data.email = cfg.email;
                if (data.address && typeof data.address === 'object') {
                    if ('streetAddress' in data.address) {
                        data.address.streetAddress = cfg.address;
                    }
                }
                tag.textContent = JSON.stringify(data, null, 2);
            } catch (e) {}
        });
    }
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
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
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

        function prevSlide() {
            slideIndex--;
            if (slideIndex < 0) {
                slideIndex = Math.ceil(slideCount / 3) - 1;
            }
            showSlides();
        }

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        setInterval(nextSlide, 5000); // Autoplay every 5 seconds

        window.addEventListener('resize', showSlides);
    }
});
