function renderHiLo(container) {
    container.innerHTML = `
        <div class="game-card">
            <h2>🎴 Higher or Lower</h2>
            <div id="hilo-display" style="font-size: 8rem; text-align: center; margin: 30px 0; min-height: 150px;">50</div>
            <input type="number" id="hilo-bet" value="100" style="padding:12px; width:200px; font-size:1.1rem;">
            <div style="margin:20px 0;">
                <button onclick="playHiLo('high')" style="margin:0 10px;">HIGHER</button>
                <button onclick="playHiLo('low')" style="margin:0 10px;">LOWER</button>
            </div>
            <p id="hilo-result" style="min-height:30px; font-size:1.2rem;"></p>
        </div>
    `;
}

async function playHiLo(choice) {
    const betInput = document.getElementById('hilo-bet');
    const bet = parseInt(betInput.value);
    const display = document.getElementById('hilo-display');
    const resultEl = document.getElementById('hilo-result');

    const prev = parseInt(display.textContent) || 50;
    const next = Math.floor(Math.random() * 100);
    const win = (choice === 'high' && next > prev) || (choice === 'low' && next < prev);

    try {
        await Casino.processBet(bet, win, 1.95);
        display.textContent = next;
        resultEl.style.color = win ? 'var(--win)' : 'var(--lose)';
        resultEl.textContent = win ? '🎉 WINNER!' : '💥 Better luck next time';
    } catch (e) {
        resultEl.textContent = e.message;
        resultEl.style.color = 'var(--lose)';
    }
}