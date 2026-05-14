function renderMines(container) {
    container.innerHTML = `
        <div class="game-card">
            <h2>💣 Mines</h2>
            <p>Mines: <select id="mine-count">
                <option value="3">3</option>
                <option value="5" selected>5</option>
                <option value="10">10</option>
            </select></p>
            <input type="number" id="mines-bet" value="100" style="padding:12px;">
            <button onclick="startMines()">Start Game</button>
            <div id="mines-grid" style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:20px 0;"></div>
            <button id="cashout-btn" onclick="cashoutMines()" style="display:none;">Cash Out</button>
            <p id="mines-result"></p>
        </div>
    `;
}

let minesGame = { active: false, mines: [], revealed: [] };

function startMines() {
    const bet = parseInt(document.getElementById('mines-bet').value);
    const mineCount = parseInt(document.getElementById('mine-count').value);

    minesGame = { active: true, mines: [], revealed: [], bet };

    // Place random mines
    let positions = [];
    while (positions.length < mineCount) {
        let pos = Math.floor(Math.random() * 25);
        if (!positions.includes(pos)) positions.push(pos);
    }
    minesGame.mines = positions;

    const grid = document.getElementById('mines-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const tile = document.createElement('button');
        tile.style.height = '60px';
        tile.style.fontSize = '1.5rem';
        tile.onclick = () => revealTile(i, bet);
        grid.appendChild(tile);
    }
    document.getElementById('cashout-btn').style.display = 'inline-block';
}

async function revealTile(index, bet) {
    if (!minesGame.active || minesGame.revealed.includes(index)) return;

    const tile = document.getElementById('mines-grid').children[index];
    if (minesGame.mines.includes(index)) {
        tile.textContent = '💣';
        tile.style.background = '#991b1b';
        await Casino.processBet(minesGame.bet, false);
        document.getElementById('mines-result').textContent = '💥 BOOM! Game Over';
        minesGame.active = false;
    } else {
        tile.textContent = '💎';
        tile.style.background = '#166534';
        minesGame.revealed.push(index);
    }
}

function cashoutMines() {
    if (!minesGame.active) return;
    const multiplier = 1 + (minesGame.revealed.length * 0.3);
    Casino.processBet(minesGame.bet, true, multiplier);
    document.getElementById('mines-result').textContent = `✅ Cashed out x${multiplier.toFixed(1)}`;
    minesGame.active = false;
}