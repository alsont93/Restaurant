const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testConnection() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
        console.error("Błąd połączenia z Supabase:", error.message);
    } else {
        console.log("Rekordy z tabeli users:", data);
    }
}

testConnection();
