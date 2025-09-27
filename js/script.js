const ROOT_URL = new URL('..', document.currentScript.src);

const NAVBAR_HTML = `<header>
    <div class="container">
        <div class="logo">
            <a href="index.html">
                <img src="images/website-logo.png" alt="Locksmith Logo">
            </a>
        </div>
        <nav>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="services.html">Services</a></li>
                <li><a href="locations.html">Locations</a></li>
                <li><a href="contact.html">Contact Us</a></li>
            </ul>
        </nav>
        <div class="header-phone">
            <a href="tel:02039513549">Call Us: 02039513549</a>
            <div class="header-social">
                <a href="https://www.facebook.com/profile.php?id=61581353704416" target="_blank" rel="noopener"><i class="fab fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/lockersmithuk/" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a>
            </div>
        </div>
        <button class="mobile-nav-toggle" aria-label="Open navigation">
            <div class="hamburger"></div>
        </button>
    </div>
</header>

<nav class="mobile-nav">
    <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="locations.html">Locations</a></li>
        <li><a href="contact.html">Contact Us</a></li>
    </ul>
</nav>`;

const FOOTER_HTML = `<footer>
    <div class="container">
        <div class="footer-flex">
            <div class="footer-about">
                <h3>Locksmith</h3>
                <p>Your local, reliable locksmith service. Available 24/7 for all your locksmith needs.</p>
            </div>
            <div class="footer-links">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="locations.html">Locations</a></li>
                    <li><a href="coverage-area.html">Coverage Area</a></li>
                    <li><a href="contact.html">Contact Us</a></li>
                    <li><a href="privacy-policy.html">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="footer-contact">
                <h3>Contact Us</h3>
                <p>Call Us: <a href="tel:02039513549">02039513549</a></p>
                <p>Email: <a href="mailto:contact@lockersmith.co.uk">contact@lockersmith.co.uk</a></p>
                <div class="social-media">
                    <a href="https://www.facebook.com/profile.php?id=61581353704416" target="_blank" rel="noopener"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://www.instagram.com/lockersmithuk/" target="_blank" rel="noopener"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </div>
        <div class="copyright">
            <p>&copy; 2025 Locksmith. All Rights Reserved.</p>
        </div>
    </div>
</footer>`;

function adjustPaths(container) {
    container.querySelectorAll('[href],[src]').forEach(el => {
        ['href','src'].forEach(attr => {
            const val = el.getAttribute(attr);
            if (val && !val.match(/^(?:[a-z]+:|#)/i)) {
                el.setAttribute(attr, new URL(val, ROOT_URL).href);
            }
        });
    });
}

async function loadComponent(id, file, fallback) {
    const container = document.getElementById(id);
    if (!container) return;
    if (location.protocol === 'file:') {
        container.innerHTML = fallback;
        adjustPaths(container);
        return;
    }
    try {
        const res = await fetch(new URL(file, ROOT_URL));
        if (!res.ok) throw new Error('Failed');
        container.innerHTML = await res.text();
    } catch (e) {
        container.innerHTML = fallback;
    }
    adjustPaths(container);
}

async function init() {
    await Promise.all([
        loadComponent('navbar-placeholder', 'navbar.html', NAVBAR_HTML),
        loadComponent('footer-placeholder', 'footer.html', FOOTER_HTML)
    ]);

    const script = document.createElement('script');
    script.src = new URL('js/main.js', ROOT_URL).href;
    script.onload = () => { if (typeof initSite === 'function') initSite(); };
    document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', init);
