require('dotenv').config();
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const username = 'CHRUPniegadaj_admin';
const plainPassword = 'P@ierogi';

async function createOrUpdateUser() {
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Check if the user already exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('id')
            .eq('username', username)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error("Błąd podczas sprawdzania użytkownika:", checkError.message);
            return;
        }

        if (existingUser) {
            // Update the user's password if they already exist
            const { error: updateError } = await supabase
                .from('users')
                .update({ password: hashedPassword })
                .eq('id', existingUser.id);

            if (updateError) {
                console.error("Błąd podczas aktualizacji użytkownika:", updateError.message);
                return;
            }

            console.log("Hasło użytkownika zostało zaktualizowane.");
        } else {
            // Add the new user
            const { error: insertError } = await supabase
                .from('users')
                .insert([{ username, password: hashedPassword }]);

            if (insertError) {
                console.error("Błąd podczas dodawania użytkownika:", insertError.message);
                return;
            }

            console.log("Użytkownik został dodany pomyślnie.");
        }
    } catch (err) {
        console.error("Nieoczekiwany błąd:", err.message);
    }
}

createOrUpdateUser();
