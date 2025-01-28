// Otwarcie i zamknięcie modala
function openReservationModal() {
    document.getElementById('reservation-modal').style.display = 'block';
}

function closeReservationModal() {
    document.getElementById('reservation-modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('reservation-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Obsługa formularza rezerwacji
document.getElementById('reservation-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = parseInt(document.getElementById('guests').value);

    // Walidacja liczby gości
    if (guests <= 0) {
        alert('Liczba gości musi być większa od zera.');
        return;
    }

    // Walidacja godziny rezerwacji
    const [hours, minutes] = time.split(':').map(Number);
    if (hours > 20 || (hours === 20 && minutes > 30)) {
        alert('Rezerwacje są możliwe tylko do godziny 20:30.');
        return;
    }

    const response = await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, date, time, guests })
    });

    const result = await response.json();
    const messageElement = document.getElementById('reservation-message');

    if (response.ok) {
        messageElement.textContent = 'Rezerwacja zakończona sukcesem!';
        document.getElementById('reservation-form').reset();
        closeReservationModal();
    } else {
        messageElement.textContent = `Błąd: ${result.message}`;
    }
});
