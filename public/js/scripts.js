document.addEventListener('DOMContentLoaded', () => {
    // Inicjalizacja mapy
    const map = L.map('map').setView([49.821, 19.045], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker([49.821, 19.045]).addTo(map)
        .bindPopup('Galeria Handlowa Gemini Park<br>Leszczyńska 20, 43-300 Bielsko-Biała')
        .openPopup();

    // Pobieranie danych menu z API
    const menuContainer = document.querySelector('.menu-list');

    if (!menuContainer) {
        console.error("Nie znaleziono elementu .menu-list w HTML");
        return;
    }

    fetch('http://localhost:3000/api/menu')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error("Oczekiwano tablicy, otrzymano:", data);
                return;
            }

            menuContainer.innerHTML = '';
            data.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.classList.add('menu-item');

                const priceNameContainer = document.createElement('div');
                priceNameContainer.classList.add('price-name-container');

                const name = document.createElement('span');
                name.classList.add('menu-name');
                name.textContent = item.name;

                const price = document.createElement('span');
                price.classList.add('menu-price');
                price.textContent = item.price ? `${item.price.toFixed(2)} zł` : "";

                priceNameContainer.appendChild(name);
                priceNameContainer.appendChild(price);
                menuItem.appendChild(priceNameContainer);

                if (item.description) {
                    const description = document.createElement('p');
                    description.classList.add('menu-description');
                    description.textContent = item.description;
                    menuItem.appendChild(description);
                }

                menuContainer.appendChild(menuItem);
            });
        })
        .catch(error => console.error("Błąd podczas pobierania menu:", error));
});
