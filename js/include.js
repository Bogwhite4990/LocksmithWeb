const pathDepth = window.location.pathname.split('/').length - 2;
const basePath = '../'.repeat(pathDepth);

async function loadComponent(id, file) {
    const response = await fetch(basePath + file);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
}

function adjustPaths(scope) {
    scope.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (href && !/^(?:[a-z]+:|#)/i.test(href)) {
            a.setAttribute('href', basePath + href);
        }
    });
    scope.querySelectorAll('img[src]').forEach(img => {
        const src = img.getAttribute('src');
        if (src && !/^(?:[a-z]+:|#)/i.test(src)) {
            img.setAttribute('src', basePath + src);
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadComponent('navbar', 'navbar.html'),
        loadComponent('footer', 'footer.html')
    ]);
    adjustPaths(document.getElementById('navbar'));
    adjustPaths(document.getElementById('footer'));
    const script = document.createElement('script');
    script.src = basePath + 'js/script.js';
    document.body.appendChild(script);
});
