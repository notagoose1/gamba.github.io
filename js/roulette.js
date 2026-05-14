function renderRoulette(container) {
    container.innerHTML = `
        <div class="game-card">
            <h2>🎰 Roulette</h2>
            <div id="roulette-wheel" style="font-size:5rem; text-align:center; margin:40px 0;">00</div>
            <input type="number" id="roulette-bet" value="50" style="padding:12px;">
            <div style="margin:20px 0;">
                <button onclick="playRoulette('red')">Red</button>
                <button onclick="playRoulette('black')">Black</button>
                <button onclick="playRoulette('green')">Green (00)</button>
            </div>
            <p id="roulette-result"></p>
        </div>
    `;
}

async function playRoulette(type) {
    const bet = parseInt(document.getElementById('roulette-bet').value);
    const resultEl = document.getElementById('roulette-result');
    const wheel = document.getElementById('roulette-wheel');

    const num = Math.floor(Math.random() * 37);
    let color = 'green';
    if (num >= 1 && num <= 18) color = 'red';
    else if (num > 18) color = 'black';

    let win = false;
    let mult = 2;
    if (type === color) {
        win = true;
        if (color === 'green') mult = 14;
    }

    try {
        await Casino.processBet(bet, win, mult);
        wheel.textContent = num;
        resultEl.style.color = win ? 'var(--win)' : 'var(--lose)';
        resultEl.textContent = win ? `✅ WIN ${Math.floor(bet*mult)}` : '❌ Lost';
    } catch(e) {
        resultEl.textContent = e.message;
    }
}