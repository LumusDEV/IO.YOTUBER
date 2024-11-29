// Gestione IndexedDB
const request = indexedDB.open('gameDatabase', 1);
let db;

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('userData')) {
        db.createObjectStore('userData', { keyPath: 'id' });
    }
};

request.onerror = function(event) {
    console.error("Errore nell'aprire il database", event);
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database aperto con successo");
    loadUserData(); // Carica i dati dell'utente appena possibile
};

// Funzione per salvare i dati dell'utente
function saveUserData(userId, xp, coins, level, prestige) {
    const transaction = db.transaction(['userData'], 'readwrite');
    const store = transaction.objectStore('userData');

    const userData = {
        id: userId,
        xp: xp,
        coins: coins,
        level: level,
        prestige: prestige
    };

    const request = store.put(userData);

    request.onsuccess = function() {
        console.log('Dati salvati con successo');
    };

    request.onerror = function(event) {
        console.error('Errore nel salvataggio dei dati', event);
    };
}

// Funzione per recuperare i dati dell'utente
function loadUserData() {
    const userId = 'user1'; // In un'applicazione reale, l'ID utente potrebbe essere dinamico
    const transaction = db.transaction(['userData'], 'readonly');
    const store = transaction.objectStore('userData');

    const request = store.get(userId);

    request.onsuccess = function(event) {
        const userData = event.target.result;
        if (userData) {
            updateUI(userData); // Aggiorna l'interfaccia utente
        } else {
            console.log('Nessun dato trovato per l\'utente');
            initializeGame(); // Inizializza il gioco se i dati non esistono
        }
    };
}

// Funzione per inizializzare il gioco
function initializeGame() {
    const userId = 'user1';
    const xp = 0;
    const coins = 0;
    const level = 1;
    const prestige = 0;

    saveUserData(userId, xp, coins, level, prestige);
    updateUI({ xp, coins, level, prestige });
}

// Funzione per aggiornare l'interfaccia utente
function updateUI(data) {
    document.getElementById('xp').textContent = data.xp;
    document.getElementById('coins').textContent = data.coins;
    document.getElementById('level').textContent = data.level;
    document.getElementById('prestige').textContent = data.prestige;
}

// Gestione del clic per guadagnare XP e monete
let xp = 0;
let coins = 0;
let level = 1;
let prestige = 0;
const xpGain = 1;
const coinGain = 1;
const clickCooldown = 2000;
let canClick = true;

document.getElementById('clickButton').addEventListener('click', function() {
    if (!canClick) return;

    xp += xpGain;
    coins += coinGain;

    if (xp >= level * 100) {
        level++;
        xp = 0; // Reset XP per il nuovo livello
    }

    if (coins >= level * 100) {
        prestige++;
        coins = 0; // Reset Monete per il nuovo prestigio
    }

    updateUI({ xp, coins, level, prestige });
    saveUserData('user1', xp, coins, level, prestige);

    // Disabilita il clic per 2 secondi
    canClick = false;
    setTimeout(() => canClick = true, clickCooldown);
});

// Gestione dello shop
document.getElementById('buyPCButton').addEventListener('click', function() {
    if (coins >= 500) {
        coins -= 500;
        xp += 5; // Ogni postazione PC aumenta gli XP guadagnati
        updateUI({ xp, coins, level, prestige });
        saveUserData('user1', xp, coins, level, prestige);
    } else {
        alert("Non hai abbastanza monete!");
    }
});


