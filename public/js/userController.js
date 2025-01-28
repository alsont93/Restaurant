require('dotenv').config();
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function addUser(username, plainPassword) {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const { data, error } = await supabase.from('users').insert([{ username, password: hashedPassword }]);
    if (error) {
        console.error("Błąd podczas dodawania użytkownika:", error.message);
    } else {
        console.log("Użytkownik dodany:", data);
    }
}

async function loginUser(username, enteredPassword) {
    console.log("Sprawdzamy użytkownika:", username);
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

    if (error || !data) {
        console.error("Nie znaleziono użytkownika lub błąd:", error?.message);
        return null;
    }

    console.log("Znaleziono użytkownika:", data);

    const validPassword = await bcrypt.compare(enteredPassword, data.password);
    console.log("Porównanie haseł:", validPassword);

    return validPassword ? data : null;
}

module.exports = {
    addUser,
    loginUser,
};
