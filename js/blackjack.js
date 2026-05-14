function renderBlackjack(container) {
    container.innerHTML = `
        <div class="game-card">
            <h2>🃏 Blackjack</h2>
            <div style="display:flex; gap:40px; justify-content:center; margin:30px 0;">
                <div>Dealer: <span id="dealer-hand">?</span></div>
                <div>You: <span id="player-hand">?</span></div>
            </div>
            <input type="number" id="bj-bet" value="100">
            <button onclick="startBlackjack()">Deal</button>
            <button onclick="hit()" style="display:none;" id="hit-btn">Hit</button>
            <button onclick="stand()" style="display:none;" id="stand-btn">Stand</button>
            <p id="bj-result"></p>
        </div>
    `;
}

// Very basic Blackjack (simplified)
let bjState = {};

function startBlackjack() {
    const bet = parseInt(document.getElementById('bj-bet').value);
    // Simplified simulation
    const playerScore = Math.floor(Math.random() * 10) + 12;
    const dealerScore = Math.floor(Math.random() * 9) + 14;

    const win = playerScore > dealerScore && playerScore <= 21;

    Casino.processBet(bet, win, 2);
    document.getElementById('player-hand').textContent = playerScore;
    document.getElementById('dealer-hand').textContent = dealerScore;
    document.getElementById('bj-result').textContent = win ? 'You Win!' : 'Dealer Wins';
}