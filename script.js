import { createClient } from '@supabase/supabase-js';

// Configurazione di Supabase
const supabaseUrl = 'https://ietepvtfcxzajqvqgely.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGVwdnRmY3h6YWpxdnFnZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NTY2OTMsImV4cCI6MjA0ODQzMjY5M30.cJF8TejUeapwU_Wx9jRN56hxlC5yPdRQpFGhvDp54f8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Funzione per salvare i dati utente
async function saveUserData(username, xp, coins, level) {
  const { data, error } = await supabase
    .from('users')
    .upsert({ username, xp, coins, level });

  if (error) {
    console.error('Errore nel salvataggio dei dati:', error);
  } else {
    console.log('Dati utente salvati:', data);
  }
}

// Funzione per ottenere i dati utente
async function getUserData(username) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error) {
    console.error('Errore nel recupero dei dati:', error);
  } else {
    console.log('Dati utente:', data);
  }
}

// Esempio di salvataggio e lettura dei dati
saveUserData('player1', 100, 50, 5);
getUserData('player1');
