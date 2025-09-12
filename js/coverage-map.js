document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('coverage-map');
  if (!mapElement) return;

  const map = L.map('coverage-map').setView([51.509865, -0.118092], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  fetch('locations/areas.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(area => {
        if (typeof area.lat === 'number' && typeof area.lng === 'number') {
          L.marker([area.lat, area.lng])
            .addTo(map)
            .bindPopup(`<a href="${area.url}">${area.name}</a>`);
        }
      });
    })
    .catch(err => console.error('Failed to load locations', err));
});
