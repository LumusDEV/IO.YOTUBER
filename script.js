let xp = 0;
let subscribers = 0;

const clickButton = document.getElementById('clickButton');
const xpDisplay = document.getElementById('xp');
const subscribersDisplay = document.getElementById('subscribers');

clickButton.addEventListener('click', () => {
    xp += 1;
    subscribers += 10;  // Ogni clic aggiunge 10 iscritti
    xpDisplay.textContent = xp;
    subscribersDisplay.textContent = subscribers;
});
