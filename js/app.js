// INITIALIZE SUPABASE
const _supabase = supabase.createClient('https://bnewlzfxazyvcqdwlzzg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuZXdsemZ4YXp5dmNxZHdsenpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDkxNTIsImV4cCI6MjA5NDA4NTE1Mn0.4FqiWgVVKmKu8sZnhpVXYCH-mzW2ZYait2WDBrXp218');

let balance = 1000.00;
let currentBet = 10.00;
let currentGame = 'mines';
let gameState = 'idle'; // idle, playing

// UI Elements
const balanceEl = document.getElementById('balance-display');
const gameCanvas = document.getElementById('game-canvas');
const gameControls = document.getElementById('game-specific-controls');
const actionBtn = document.getElementById('primary-action-btn');

function updateBalanceUI() {
    balanceEl.innerText = balance.toFixed(2);
}

function adjustBet(multiplier) {
    let val = parseFloat(document.getElementById('bet-amount').value);
    document.getElementById('bet-amount').value = (val * multiplier).toFixed(2);
}

// --- GAME: MINES ---
let mineCount = 3;
let minesLocation = [];
let revealedTiles = [];

function initMines() {
    gameControls.innerHTML = `
        <label class="text-xs font-bold mb-2 block">Mines</label>
        <select id="mine-select" class="stake-input w-full p-2 rounded mb-4">
            ${[1,3,5,10,24].map(n => `<option value="${n}" ${n==3?'selected':''}>${n}</option>`).join('')}
        </select>
    `;
    
    renderMinesGrid();
}

function renderMinesGrid() {
    gameCanvas.innerHTML = `<div class="game-grid w-full max-w-[350px]" id="mines-grid"></div>`;
    const grid = document.getElementById('mines-grid');
    for (let i = 0; i < 25; i++) {
        const tile = document.createElement('div');
        tile.className = 'mine-tile flex items-center justify-center text-2xl';
        tile.dataset.index = i;
        tile.onclick = () => handleTileClick(i);
        grid.appendChild(tile);
    }
}

function handleTileClick(index) {
    if (gameState !== 'playing') return;
    // Logic for checking mine or gem
    // If Gem: update multiplier, allow Cash Out
    // If Mine: End game, balance lost
}

actionBtn.onclick = () => {
    if (gameState === 'idle') {
        startMines();
    } else {
        cashOut();
    }
};

function startMines() {
    const bet = parseFloat(document.getElementById('bet-amount').value);
    if (bet > balance) return alert("Insufficient funds");
    
    balance -= bet;
    updateBalanceUI();
    gameState = 'playing';
    actionBtn.innerText = 'Cash Out';
    actionBtn.style.backgroundColor = '#facc15'; // Yellow for cashout
    
    // Generate mines
    minesLocation = [];
    while(minesLocation.length < mineCount) {
        let r = Math.floor(Math.random() * 25);
        if(!minesLocation.includes(r)) minesLocation.push(r);
    }
}

// Initial Load
initMines();
