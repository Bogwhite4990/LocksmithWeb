document.addEventListener('DOMContentLoaded', function() {
    // This script handles all the dynamic functionality for the website.

    // Mobile navigation toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (navToggle && mobileNav) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.addEventListener('click', function() {
            const isActive = mobileNav.classList.toggle('is-active');
            navToggle.classList.toggle('is-active', isActive);
            navToggle.setAttribute('aria-expanded', isActive);
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
        const slidesContainer = slider.querySelector('.testimonial-slides');
        const slides = slidesContainer.querySelectorAll('.testimonial-slide');
        const nextBtn = slider.querySelector('.next-slide');
        const prevBtn = slider.querySelector('.prev-slide');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        function startSlider() {
            slideInterval = setInterval(nextSlide, 5000); // Autoplay every 5 seconds
        }

        function stopSlider() {
            clearInterval(slideInterval);
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                stopSlider();
                nextSlide();
                startSlider();
            });

            prevBtn.addEventListener('click', () => {
                stopSlider();
                prevSlide();
                startSlider();
            });
        }

        // Initially show the first slide and start the slider
        showSlide(currentSlide);
        startSlider();
    }

    // Reveal all locations on index page
    const viewAllBtn = document.querySelector('#view-all-locations');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.location-item.hidden').forEach(item => item.classList.remove('hidden'));
            viewAllBtn.style.display = 'none';
        });
    }

    // Animated counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace(/,/g, '');
            const increment = target / 200;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment).toLocaleString();
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        updateCount();
    });

    // Floating phone bubble and WhatsApp chat button
    const phoneBubble = document.createElement('div');
    phoneBubble.className = 'phone-bubble';
    phoneBubble.innerHTML = '<a href="tel:0123-456-7890">0123-456-7890</a>';
    document.body.appendChild(phoneBubble);

    const whatsappBtn = document.createElement('a');
    whatsappBtn.className = 'whatsapp-chat';
    whatsappBtn.href = 'https://wa.me/01234567890';
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener';
    whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    document.body.appendChild(whatsappBtn);
});
