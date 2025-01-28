function openAdminPanel() {
    document.querySelector('.content').style.display = 'none'; // Ukryj stronę główną
    document.getElementById('admin-dashboard').style.display = 'block'; // Pokaż panel admina
}

function logoutAdmin() {
    localStorage.removeItem('adminToken');
    document.querySelector('.content').style.display = 'block'; // Pokaż stronę główną
    document.getElementById('admin-dashboard').style.display = 'none'; // Ukryj panel admina
}

function showReservations() {
    document.getElementById('dashboard-content').innerHTML = '<h3>Manage Reservations</h3>';
    fetch('http://localhost:3000/api/reservations', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken') }
    })
        .then((response) => response.json())
        .then((data) => {
            const content = data
                .map(
                    (res) => `
                <div>
                    <p>${res.name} (${res.date} at ${res.time}, Guests: ${res.guests})</p>
                    <button onclick="deleteReservation(${res.id})">Delete</button>
                </div>`
                )
                .join('');
            document.getElementById('dashboard-content').innerHTML = content;
        });
}

function showMenu() {
    document.getElementById('dashboard-content').innerHTML = '<h3>Manage Menu</h3>';
    // Pobierz i wyświetl dane menu
}
