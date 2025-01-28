document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.querySelector('.menu-list');

    if (!menuContainer) {
        console.error("Nie znaleziono elementu .menu-list w HTML");
        return;
    }

    // Pobieranie danych menu z API
    fetch('http://localhost:3000/api/menu')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error("Oczekiwano tablicy, otrzymano:", data);
                return;
            }

            menuContainer.innerHTML = ''; 

            const customHeaders = {
                "bao": {
                    name: "Bułeczka Bao",
                    items: ["CHRUP SHRIMP", "STICKY BOCZNIAK", "FISZ N CHRUP", "PULLED PORK", "BIELSKIE BAO"]
                },
                "zapiekanki": {
                    name: "Zapiekanki",
                    items: ["Zapiekanka Klasyczna", "Zapiekanka z Serem", "Zapiekanka BBQ"]
                },
                "frytki": {
                    name: "Dodatki",
                    items: ["Frytki Klasyczne", "Frytki z Serem", "Frytki z Sosem"]
                }
            };

            let addedHeaders = {};

            data.forEach(item => {
                let headerId = null;

                // Sprawdzanie kategorii potrawy
                Object.keys(customHeaders).forEach(category => {
                    if (customHeaders[category].items.includes(item.name)) {
                        headerId = category;
                    }
                });

                if (headerId && !addedHeaders[headerId]) {
                    const categoryHeader = document.createElement('h2');
                    categoryHeader.classList.add('category-header');
                    categoryHeader.textContent = customHeaders[headerId].name;
                    menuContainer.appendChild(categoryHeader);
                    addedHeaders[headerId] = true;
                }

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
