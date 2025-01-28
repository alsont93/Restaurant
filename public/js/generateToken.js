require('dotenv').config();
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,      // CLIENT_ID z pliku .env
    process.env.CLIENT_SECRET,  // CLIENT_SECRET z pliku .env
    'http://localhost'          // URI przekierowania
);

const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://mail.google.com/'], // Dodaj wymagany zakres
});
console.log('Otwórz ten URL w przeglądarce:', url);





async function getRefreshToken() {
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        console.log('Twój refresh token:', tokens.refresh_token);
    } catch (error) {
        console.error('Błąd podczas uzyskiwania tokena:', error);
    }
}

getRefreshToken();
