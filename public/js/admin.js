document.addEventListener('DOMContentLoaded', () => {
    const reservationsManagement = document.getElementById('reservations-management');

    // Obsługa przycisku "Pokaż Rezerwacje"
    document.getElementById('show-reservations').addEventListener('click', async () => {
        reservationsManagement.style.display = 'block';
        loadReservations();
    });

    // Wylogowanie
    document.getElementById('logout-admin').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        alert('Wylogowano.');
        window.location.href = 'index.html'; // Przekierowanie na stronę główną
    });
});

// Funkcja ładowania rezerwacji z bazy danych
async function loadReservations() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        alert('Musisz się zalogować, aby zobaczyć rezerwacje.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/reservations', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const reservationsList = document.getElementById('reservations-list');
        reservationsList.innerHTML = '';

        if (response.ok) {
            const data = await response.json();
            data.forEach(reservation => {
                const reservationDiv = document.createElement('div');
                reservationDiv.innerHTML = `
                    <div>
                        <p><strong>${reservation.name}</strong> - ${reservation.date} (${reservation.time})</p>
                        <p>Liczba gości: ${reservation.guests}</p>
                        <p>Email: ${reservation.email}, Telefon: ${reservation.phone}</p>
                    </div>
                    <hr />
                `;
                reservationsList.appendChild(reservationDiv);
            });
        } else {
            reservationsList.innerHTML = '<p>Nie udało się załadować rezerwacji.</p>';
        }
    } catch (error) {
        console.error('Błąd podczas ładowania rezerwacji:', error);
    }
}
