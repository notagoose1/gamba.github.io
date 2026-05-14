function renderPlinko(container) {
    container.innerHTML = `
        <div class="game-card">
            <h2>🔼 Plinko</h2>
            <select id="plinko-risk">
                <option value="low">Low Risk</option>
                <option value="med" selected>Medium</option>
                <option value="high">High Risk</option>
            </select>
            <input type="number" id="plinko-bet" value="50">
            <button onclick="dropPlinko()">DROP BALL</button>
            <div id="plinko-result" style="margin-top:20px; font-size:1.3rem;"></div>
        </div>
    `;
}

async function dropPlinko() {
    const bet = parseInt(document.getElementById('plinko-bet').value);
    const risk = document.getElementById('plinko-risk').value;
    const resultEl = document.getElementById('plinko-result');

    let mult = 1;
    if (risk === 'low') mult = [0.5, 1, 1.5, 2][Math.floor(Math.random()*4)];
    else if (risk === 'med') mult = [0.3, 1, 2.5, 4, 6][Math.floor(Math.random()*5)];
    else mult = [0.2, 1, 3, 8, 15][Math.floor(Math.random()*5)];

    const win = mult > 1;

    try {
        await Casino.processBet(bet, win, mult);
        resultEl.style.color = win ? 'var(--win)' : 'var(--lose)';
        resultEl.textContent = win ? `🎉 Multiplier: x${mult}` : `💸 Lost`;
    } catch(e) {
        resultEl.textContent = e.message;
    }
}