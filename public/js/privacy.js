// Funkcja do otwierania modala
function openPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    modal.style.display = 'block';
}

// Funkcja do zamykania modala
function closePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    modal.style.display = 'none';
}

// Obsługa zamknięcia modala przy kliknięciu poza jego zawartość
window.onclick = function(event) {
    const modal = document.getElementById('privacy-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
