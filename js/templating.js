document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch and insert HTML content
    const includeHTML = (elementId, filePath) => {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const targetElement = document.getElementById(elementId);
                if (targetElement) {
                    targetElement.innerHTML = data;
                }
            })
            .catch(error => {
                console.error('Error fetching HTML:', error);
            });
    };

    // Create placeholders in the body
    const body = document.body;
    const headerPlaceholder = document.createElement('div');
    headerPlaceholder.id = 'header-placeholder';
    body.insertBefore(headerPlaceholder, body.firstChild);

    const footerPlaceholder = document.createElement('div');
    footerPlaceholder.id = 'footer-placeholder';
    body.appendChild(footerPlaceholder);

    // Load header and footer
    includeHTML('header-placeholder', '/partials/header.html');
    includeHTML('footer-placeholder', '/partials/footer.html');

    // Load contact info into footer after a short delay
    setTimeout(() => {
        const contactPlaceholder = document.getElementById('contact-info-placeholder');
        if (contactPlaceholder) {
            includeHTML('contact-info-placeholder', '/partials/contact-info.html');
        }
    }, 200); // Adjust delay as needed
});
