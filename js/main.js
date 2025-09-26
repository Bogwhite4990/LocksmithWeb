const CONTACT_INFO = {
    phone: '+44 7757 666 691',
    email: 'contact@lockersmith.co.uk',
    address: {
        street: '58 Stepney Way',
        city: 'London',
        region: 'Tower Hamlets',
        postalCode: 'E1 2EN',
        country: 'United Kingdom',
        full: '58 Stepney Way, Tower Hamlets, London, E1 2EN, United Kingdom'
    },
    social: {
        facebook: 'https://www.facebook.com/your-locksmith',
        instagram: 'https://www.instagram.com/your-locksmith'
    }
};

function initSite() {
    // This script handles all the dynamic functionality for the website.
    const phoneDigits = CONTACT_INFO.phone.replace(/[^0-9]/g, '');

    // Mobile navigation toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const header = document.querySelector('header');

    // Update contact information across the page
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
        a.href = `tel:${phoneDigits}`;

        const phoneElement = a.querySelector('.phone-number-text');
        if (phoneElement) {
            phoneElement.textContent = CONTACT_INFO.phone;
            return;
        }

        if (/\d/.test(a.textContent)) {
            a.textContent = a.textContent.replace(/[\d\-\s]+/, CONTACT_INFO.phone);
        } else if (a.textContent.trim() !== '') {
            a.textContent = `${a.textContent.trim()} ${CONTACT_INFO.phone}`.trim();
        } else {
            a.textContent = CONTACT_INFO.phone;
        }
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
        a.href = `mailto:${CONTACT_INFO.email}`;
        if (a.textContent.includes('@')) {
            a.textContent = CONTACT_INFO.email;
        } else if (a.textContent.trim() !== '') {
            a.textContent = `${a.textContent.trim()} ${CONTACT_INFO.email}`.trim();
        } else {
            a.textContent = CONTACT_INFO.email;
        }
    });

    document.querySelectorAll('.contact-address').forEach(el => {
        el.textContent = CONTACT_INFO.address.full;
    });

    document.querySelectorAll('a').forEach(a => {
        if (a.querySelector('.fa-facebook-f')) {
            a.href = CONTACT_INFO.social.facebook;
        }
        if (a.querySelector('.fa-instagram')) {
            a.href = CONTACT_INFO.social.instagram;
        }
    });

    document.querySelectorAll('script[type="application/ld+json"]').forEach(tag => {
        try {
            const data = JSON.parse(tag.textContent);
            if (data['@type'] === 'Locksmith') {
                data.telephone = CONTACT_INFO.phone;
                data.address = data.address || {};
                data.address.streetAddress = CONTACT_INFO.address.street;
                data.address.addressLocality = CONTACT_INFO.address.city;
                if (CONTACT_INFO.address.region) {
                    data.address.addressRegion = CONTACT_INFO.address.region;
                }
                data.address.postalCode = CONTACT_INFO.address.postalCode;
                data.address.addressCountry = CONTACT_INFO.address.country;
                data.sameAs = [CONTACT_INFO.social.facebook, CONTACT_INFO.social.instagram];
                tag.textContent = JSON.stringify(data, null, 2);
            }
        } catch (e) {}
    });

    function setMobileNavOffset() {
        if (header && mobileNav) {
            const headerHeight = header.offsetHeight;
            mobileNav.style.top = headerHeight + 'px';
            mobileNav.style.height = `calc(100vh - ${headerHeight}px)`;
        }
    }

    setMobileNavOffset();
    window.addEventListener('resize', setMobileNavOffset);

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
            const count = parseInt(counter.innerText.replace(/\D/g, ''), 10) || 0;
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

    // Contact forms with captcha
    document.querySelectorAll('form').forEach(form => {
        const captchaImg = form.querySelector('.captcha-image');
        const captchaToken = form.querySelector('input[name="captchaToken"]');
        const captchaInput = form.querySelector('input[name="captchaValue"]');
        const refreshBtn = form.querySelector('.refresh-captcha');
        const statusMessage = form.querySelector('.form-status');
        const backendMode = (form.dataset.backend || 'auto').toLowerCase();
        const backendEnabled = !['static', 'disabled', 'none', 'offline'].includes(backendMode);
        const usingRemoteEndpoints = backendEnabled && location.protocol !== 'file:';

        if (!captchaImg || !captchaToken || !captchaInput) {
            return;
        }

        const showStatus = (message, type = 'info') => {
            if (!statusMessage) {
                if (type === 'error') {
                    alert(message);
                }
                return;
            }
            statusMessage.textContent = message;
            statusMessage.classList.remove('error', 'success', 'info');
            statusMessage.classList.add(type);
        };

        async function loadCaptcha() {
            try {
                if (usingRemoteEndpoints) {
                    const res = await fetch('/captcha', { credentials: 'same-origin' });
                    if (!res.ok) throw new Error('Network response was not ok');
                    const data = await res.json();
                    captchaImg.src = data.image;
                    captchaToken.value = data.token;
                    captchaImg.dataset.answer = '';
                    return;
                }
                throw new Error('local');
            } catch (e) {
                if (usingRemoteEndpoints) {
                    console.error('Captcha load failed', e);
                }
                const text = Math.random().toString(36).substring(2, 8);
                const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="#555">${text}</text></svg>`;
                captchaImg.src = `data:image/svg+xml;base64,${btoa(svg)}`;
                captchaImg.dataset.answer = text;
                captchaToken.value = 'local';
                if (statusMessage) {
                    const message = usingRemoteEndpoints
                        ? 'Offline CAPTCHA loaded. Please enter the characters shown above.'
                        : 'Static CAPTCHA loaded. Please enter the characters shown above.';
                    showStatus(message, 'info');
                }
            }
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', loadCaptcha);
        }
        loadCaptcha();

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = new FormData(form);
            if (captchaToken.value === 'local') {
                const answer = captchaImg.dataset.answer || '';
                if (captchaInput.value.trim().toLowerCase() !== answer.toLowerCase()) {
                    await loadCaptcha();
                    showStatus('Invalid CAPTCHA. Please try again.', 'error');
                    return;
                }
            }
            if (usingRemoteEndpoints) {
                try {
                    const endpoint = location.protocol === 'file:' ? 'http://localhost:3000/contact' : '/contact';
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(Object.fromEntries(formData.entries()))
                    });
                    if (!res.ok) {
                        throw new Error('HTTP ' + res.status);
                    }
                    const result = await res.json();
                    if (result.success) {
                        form.reset();
                        await loadCaptcha();
                        showStatus('Message sent successfully.', 'success');
                        return;
                    }
                    throw new Error(result.error || 'Submission failed');
                } catch (err) {
                    console.warn('Falling back to mailto submission', err);
                }
            }

            let name = (formData.get('name') || '').trim();
            const email = (formData.get('email') || '').trim();
            const phone = (formData.get('phone') || '').trim();
            const message = (formData.get('message') || '').trim();

            if (!name) {
                name = 'Website visitor';
            }

            const lines = [`Name: ${name}`];
            if (email) lines.push(`Email: ${email}`);
            if (phone) lines.push(`Phone: ${phone}`);
            lines.push('');
            lines.push('Message:');
            lines.push(message || '');

            const mailto = new URLSearchParams({
                subject: `Website enquiry from ${name}`,
                body: lines.join('\n')
            });
            const mailtoLink = `mailto:${CONTACT_INFO.email}?${mailto.toString().replace(/\+/g, '%20')}`;
            await loadCaptcha();
            const statusText = usingRemoteEndpoints
                ? 'We could not reach the message service. Please send your message using your email app.'
                : 'Please send your message using your email app. The form will open your default email program.';
            showStatus(statusText, 'error');
            setTimeout(() => {
                window.location.href = mailtoLink;
            }, 150);
        });
    });

    // Floating phone bubble and WhatsApp chat button
    const phoneBubble = document.createElement('div');
    phoneBubble.className = 'phone-bubble';
    phoneBubble.innerHTML = `<a href="tel:${phoneDigits}">${CONTACT_INFO.phone}</a>`;
    document.body.appendChild(phoneBubble);

    const whatsappBtn = document.createElement('a');
    whatsappBtn.className = 'whatsapp-chat';
    whatsappBtn.href = `https://wa.me/${phoneDigits}`;
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener';
    whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    document.body.appendChild(whatsappBtn);
}
