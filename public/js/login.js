// Otwarcie modala logowania admina
function openAdminLoginModal() {
    document.getElementById('admin-login-modal').style.display = 'block';
}

// Zamknięcie modala logowania admina
function closeAdminLoginModal() {
    document.getElementById('admin-login-modal').style.display = 'none';
}

// Logowanie admina
// Logowanie admina
document.getElementById('admin-login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
           
            localStorage.setItem('adminToken', result.token);
            alert('Zalogowano pomyślnie! Otwieranie panelu admina w nowym oknie...');

            // Otwórz panel administracyjny w nowym oknie
            window.open('admin.html', '_blank');
        } else {
            alert('Logowanie nieudane: ' + result.message);
        }
    } catch (error) {
        console.error('Błąd podczas logowania:', error);
        alert('Błąd serwera podczas logowania.');
    }
});



// Otwórz panel admina
function openAdminPanel() {
    document.querySelector('.content').style.display = 'none'; // Ukryj główną stronę
    document.getElementById('admin-dashboard').style.display = 'block'; // Pokaż panel admina
}


// Wylogowanie admina
function logoutAdmin() {
    localStorage.removeItem('adminToken');
    document.querySelector('.content').style.display = 'block'; // Pokaż stronę główną
    document.getElementById('admin-dashboard').style.display = 'none'; // Ukryj panel admina
}



// Wyświetlenie sekcji zarządzania rezerwacjami
function showReservations() {
    const token = localStorage.getItem('adminToken');
    fetch('http://localhost:3000/api/reservations', {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(response => response.json())
        .then(data => {
            const reservationsHtml = data.map(reservation => `
                <div>
                    <p>${reservation.name} - ${reservation.date} (${reservation.time})</p>
                    <button onclick="deleteReservation(${reservation.id})">Delete</button>
                </div>
            `).join('');
            document.getElementById('dashboard-content').innerHTML = reservationsHtml;
        });
}


// Usuwanie rezerwacji
function deleteReservation(id) {
    const token = localStorage.getItem('adminToken');
    fetch(`http://localhost:3000/api/reservations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    }).then(() => showReservations());
}

