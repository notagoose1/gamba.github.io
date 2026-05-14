let currentGame = 'hilo';

function switchGame(game) {
    currentGame = game;
    const container = document.getElementById('game-container');
    container.innerHTML = '';

    document.querySelectorAll('.nav-games button').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${game}'`));
    });

    if (game === 'hilo') renderHiLo(container);
    else if (game === 'roulette') renderRoulette(container);
    else if (game === 'mines') renderMines(container);
    else if (game === 'plinko') renderPlinko(container);
    else if (game === 'blackjack') renderBlackjack(container);
}
