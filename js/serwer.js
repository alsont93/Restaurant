require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { addUser, loginUser } = require('../public/js/userController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Obsługa plików statycznych
app.use(express.static(path.join(__dirname, '..', 'public')));

// Obsługa głównej ścieżki
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
// Pobranie zmiennych z pliku .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// Middleware autoryzacji
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token wymagany.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Nieprawidłowy token:', err);
            return res.status(403).json({ message: 'Nieprawidłowy token.' });
        }
        req.user = user;
        next();
    });
}

// Endpoint rejestracji użytkownika
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nazwa użytkownika i hasło są wymagane.' });
    }

    const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

    if (existingUser) {
        return res.status(409).json({ message: 'Nazwa użytkownika już istnieje.' });
    }

    try {
        await addUser(username, password);
        res.json({ message: 'Użytkownik zarejestrowany pomyślnie.' });
    } catch (error) {
        console.error("Błąd podczas rejestracji użytkownika:", error.message);
        res.status(500).json({ message: 'Błąd serwera podczas rejestracji.' });
    }
});

// Endpoint do logowania
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Nazwa użytkownika i hasło są wymagane.' });
    }

    const user = await loginUser(username, password);
    if (!user) return res.status(401).json({ message: 'Nieprawidłowe dane logowania.' });

    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, message: 'Logowanie zakończone sukcesem!' });
});

// Endpoint do pobierania rezerwacji
app.get('/api/reservations', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase.from('reservations').select('*');
        if (error) {
            console.error("Błąd pobierania rezerwacji:", error.message);
            return res.status(500).json({ message: 'Błąd pobierania rezerwacji.' });
        }
        res.json(data);
    } catch (error) {
        console.error('Nieoczekiwany błąd:', error.message);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// Endpoint do rezerwacji stolika
app.post('/api/reservations', async (req, res) => {
    const { name, email, phone, date, time, guests } = req.body;

    if (guests <= 0) {
        return res.status(400).json({ error: 'Liczba gości musi być większa od zera' });
    }

    const [hours, minutes] = time.split(':').map(Number);
    if (hours > 20 || (hours === 20 && minutes > 30)) {
        return res.status(400).json({ error: 'Rezerwacje są możliwe tylko do godziny 20:30.' });
    }

    try {
        const { data, error } = await supabase.from('reservations').insert([{ name, email, phone, date, time, guests }]);
        if (error) {
            console.error("Błąd dodawania rezerwacji:", error.message);
            return res.status(500).json({ message: 'Błąd dodawania rezerwacji.' });
        }
        res.status(201).json({ message: 'Rezerwacja została dodana pomyślnie.' });
    } catch (error) {
        console.error('Nieoczekiwany błąd:', error.message);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// Endpoint do zarządzania menu
app.post('/api/menu', authenticateToken, async (req, res) => {
    const { name, description, price } = req.body;

    if (!name || price == null) {
        return res.status(400).json({ message: 'Nazwa i cena potrawy są wymagane.' });
    }

    try {
        const { data, error } = await supabase.from('menu_items').insert([{ name, description, price }]);
        if (error) {
            console.error("Błąd dodawania potrawy:", error.message);
            return res.status(500).json({ message: 'Błąd dodawania potrawy.' });
        }
        res.status(201).json(data);
    } catch (error) {
        console.error("Nieoczekiwany błąd:", error.message);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// Endpoint do pobierania menu
app.get('/api/menu', async (req, res) => {
    try {
        const { data, error } = await supabase.from('menu_items').select('id, name, description, price');
        if (error) {
            console.error("Błąd pobierania menu:", error.message);
            return res.status(500).json({ message: 'Błąd pobierania menu.' });
        }
        res.json(data);
    } catch (error) {
        console.error("Nieoczekiwany błąd:", error.message);
        res.status(500).json({ message: 'Wystąpił błąd serwera.' });
    }
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
