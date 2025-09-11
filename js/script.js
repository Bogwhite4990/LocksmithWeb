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
