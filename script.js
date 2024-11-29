// Crea o apri il database
const request = indexedDB.open('gameDatabase', 1); // "gameDatabase" è il nome del database

let db;

// Funzione per disabilitare un pulsante per 2 secondi
function disableButton(buttonId) {
    const button = document.getElementById(buttonId);
    button.disabled = true;  // Disabilita il pulsante
    setTimeout(() => {
        button.disabled = false;  // Riabilita il pulsante dopo 2 secondi
    }, 2000); // 2000 ms = 2 secondi
}

request.onupgradeneeded = function(event) {
    db = event.target.result;

    // Se il database è nuovo, creiamo una nuova "store" per i dati degli utenti
    if (!db.objectStoreNames.contains('userData')) {
        db.createObjectStore('userData', { keyPath: 'id' }); // id è la chiave primaria
    }
};

request.onerror = function(event) {
    console.error("Errore nell'aprire il database", event);
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database aperto con successo");
};

// Funzione per salvare i dati dell'utente
function saveUserData(userId, xp, coins) {
    disableButton('saveButton'); // Disabilita il pulsante per 2 secondi

    const transaction = db.transaction(['userData'], 'readwrite');
    const store = transaction.objectStore('userData');

    const userData = {
        id: userId, // l'ID dell'utente è la chiave
        xp: xp,
        coins: coins
    };

    const request = store.put(userData); // 'put' salva o aggiorna i dati

    request.onsuccess = function() {
        console.log('Dati salvati con successo');
    };

    request.onerror = function(event) {
        console.error('Errore nel salvataggio dei dati', event);
    };
}

// Funzione per ottenere i dati dell'utente
function getUserData(userId) {
    disableButton('loadButton'); // Disabilita il pulsante per 2 secondi

    const transaction = db.transaction(['userData'], 'readonly');
    const store = transaction.objectStore('userData');

    const request = store.get(userId); // Recupera i dati per l'ID utente

    request.onsuccess = function(event) {
        const userData = event.target.result;
        if (userData) {
            console.log('Dati recuperati:', userData);
        } else {
            console.log('Nessun dato trovato per l\'utente', userId);
        }
    };

    request.onerror = function(event) {
        console.error('Errore nel recupero dei dati', event);
    };
}

// Funzione per aggiornare i dati dell'utente
function updateUserData(userId, newXp, newCoins) {
    disableButton('updateButton'); // Disabilita il pulsante per 2 secondi

    const transaction = db.transaction(['userData'], 'readwrite');
    const store = transaction.objectStore('userData');

    const request = store.get(userId);

    request.onsuccess = function(event) {
        const userData = event.target.result;
        if (userData) {
            // Aggiorna i dati
            userData.xp = newXp;
            userData.coins = newCoins;

            const updateRequest = store.put(userData); // Usa 'put' per aggiornare

            updateRequest.onsuccess = function() {
                console.log('Dati aggiornati con successo');
            };
        } else {
            console.log('Utente non trovato');
        }
    };

    request.onerror = function(event) {
        console.error('Errore nel recupero per aggiornamento', event);
    };
}

// Funzione per chiudere il database
function closeDatabase() {
    if (db) {
        db.close();
        console.log("Database chiuso");
    }
}

