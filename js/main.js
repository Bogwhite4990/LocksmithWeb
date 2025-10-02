const CONTACT_INFO = {
    phone: {
        display: '02039513549',
        local: '02039513549',
        international: '+44 20 3951 3549',
        whatsapp: '447757666691'
    },
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
        facebook: 'https://www.facebook.com/profile.php?id=61581353704416',
        instagram: 'https://www.instagram.com/lockersmithuk/'
    }
};

function initSite() {
    // This script handles all the dynamic functionality for the website.
    const googleAdsConfig = window.GOOGLE_ADS_CONFIG || {
        conversionId: 'AW-17608473030',
        phoneConversionLabel: 'AW-17608473030/LABEL_PHONE',
        whatsappConversionLabel: 'AW-17608473030/LABEL_WHATSAPP'
    };
    const phoneConversionAttribute = googleAdsConfig.phoneConversionLabel
        ? "return gtag_report_conversion(this.href);"
        : '';
    const whatsappConversionAttribute = googleAdsConfig.whatsappConversionLabel
        ? `if(window.gtag){gtag('event','conversion',{'send_to':'${googleAdsConfig.whatsappConversionLabel}'});}`
        : '';
    const phoneFormats = CONTACT_INFO.phone;
    const phoneLinks = new Set();
    const localDialString = phoneFormats.local;
    const internationalDialString = phoneFormats.international.replace(/\s+/g, '');
    const displayPhone = phoneFormats.display;
    const whatsappDialString = phoneFormats.whatsapp;
    const whatsappMessage = 'Hello, I need urgent help with a locksmith. Can you assist me?';
    const whatsappMessageEncoded = encodeURIComponent(whatsappMessage);
    const phoneNumberPattern = /\+?\d[\d\s()-]{6,}\d/g;
    let currentCountryCode = 'GB';

    function normalizePhoneText(text) {
        if (!text) {
            return displayPhone;
        }

        return text.replace(phoneNumberPattern, displayPhone);
    }

    function registerPhoneLink(link) {
        if (!link || phoneLinks.has(link)) {
            return;
        }

        link.classList.add('phone-link');
        link.dataset.display = displayPhone;
        link.dataset.local = localDialString;
        link.dataset.int = internationalDialString;

        const ariaLabel = link.getAttribute('aria-label');
        if (ariaLabel) {
            link.setAttribute('aria-label', normalizePhoneText(ariaLabel));
        }

        const phoneElement = link.querySelector('.phone-number-text');
        if (phoneElement) {
            phoneElement.textContent = displayPhone;
        } else if (link.childElementCount === 0) {
            const normalizedText = normalizePhoneText(link.textContent).trim();
            link.textContent = normalizedText || displayPhone;
        } else {
            link.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent = normalizePhoneText(node.textContent);
                }
            });
        }

        phoneLinks.add(link);

        if (phoneConversionAttribute) {
            link.setAttribute('onclick', phoneConversionAttribute);
        }
    }

    function applyPhoneHrefByCountry(countryCode) {
        currentCountryCode = (countryCode || 'GB').toUpperCase();
        const hrefValue = currentCountryCode === 'GB' ? `tel:${localDialString}` : `tel:${internationalDialString}`;
        phoneLinks.forEach(link => {
            if (link instanceof HTMLAnchorElement) {
                link.href = hrefValue;
            }
        });
    }

    // Mobile navigation toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const header = document.querySelector('header');

    // Update contact information across the page
    document.querySelectorAll('a[href^="tel:"]').forEach(registerPhoneLink);

    applyPhoneHrefByCountry('GB');

    fetch('https://ipapi.co/json/')
        .then(response => (response.ok ? response.json() : null))
        .then(data => {
            if (data && typeof data.country_code === 'string' && data.country_code.trim() !== '') {
                applyPhoneHrefByCountry(data.country_code.trim());
            }
        })
        .catch(() => {});

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
                data.telephone = internationalDialString;
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

    // Contact forms that use the visitor's email client
    document.querySelectorAll('[data-mailto-form]').forEach(form => {
        const recipient = form.dataset.mailto || CONTACT_INFO.email;
        form.dataset.mailto = recipient;

        form.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(form);
            const name = (formData.get('name') || '').trim();
            const email = (formData.get('email') || '').trim();
            const phone = (formData.get('phone') || '').trim();
            const message = (formData.get('message') || '').trim();

            if (!email) {
                alert('Please add your email address so we can reply.');
                return;
            }

            const subjectBase = form.dataset.mailtoSubject || 'New locksmith enquiry';
            const subject = name ? `${subjectBase}: ${name}` : subjectBase;
            const bodyLines = [
                `Name: ${name || 'N/A'}`,
                `Email: ${email}`
            ];

            if (phone) {
                bodyLines.push(`Phone: ${phone}`);
            }

            bodyLines.push('', 'Message:', message || 'N/A');

            const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

            window.location.href = mailtoLink;
            alert('Your email app will open with the message ready to send.');
            form.reset();
        });
    });

    // Floating phone bubble and WhatsApp chat button
    const phoneBubble = document.createElement('div');
    phoneBubble.className = 'phone-bubble';
    const phoneBubbleLink = document.createElement('a');
    phoneBubbleLink.textContent = displayPhone;
    registerPhoneLink(phoneBubbleLink);
    phoneBubble.appendChild(phoneBubbleLink);
    document.body.appendChild(phoneBubble);

    const whatsappBtn = document.createElement('a');
    whatsappBtn.className = 'whatsapp-chat';
    whatsappBtn.href = `https://wa.me/${whatsappDialString}?text=${whatsappMessageEncoded}`;
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener';
    whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    if (whatsappConversionAttribute) {
        whatsappBtn.setAttribute('onclick', whatsappConversionAttribute);
    }
    document.body.appendChild(whatsappBtn);

    const whatsappLinkSelectors = ['a[href*="wa.me"]', 'a[href*="api.whatsapp.com"]'];
    document.querySelectorAll(whatsappLinkSelectors.join(',')).forEach(link => {
        link.href = `https://wa.me/${whatsappDialString}?text=${whatsappMessageEncoded}`;
        const relTokens = new Set(
            link.rel
                .split(/\s+/)
                .map(token => token.trim())
                .filter(Boolean)
        );
        relTokens.add('noopener');
        link.rel = Array.from(relTokens).join(' ');
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
        }
        if (whatsappConversionAttribute) {
            link.setAttribute('onclick', whatsappConversionAttribute);
        }
    });

    applyPhoneHrefByCountry(currentCountryCode);
}
