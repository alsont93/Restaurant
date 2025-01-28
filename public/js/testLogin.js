const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testUserFetch() {
    const username = 'CHRUPniegadaj_admin';
    console.log("Sprawdzamy użytkownika:", username);

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error) {
        console.error("Błąd podczas testowania zapytania:", error);
    } else {
        console.log("Znaleziono użytkownika:", data);
    }
}

testUserFetch();
