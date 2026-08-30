/* MODULE: CYBER BLACKJACK 21 */
(function initBlackjack() {
    console.log("🃏 Blackjack Module Loaded!");
    const container = document.getElementById("game-blackjack");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🃏 Cyber Blackjack 21</h2>
            <p style="font-size:11px; color:#94a3b8;">Hit 21 or get closer than Dealer to win 2X!</p>
            <div id="bjScoreDisplay" style="font-size:24px; margin:15px 0; font-weight:800; color:var(--neon-blue);">Player: 0 | Dealer: 0</div>
            <input type="number" id="bjBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playBlackjack()" style="padding:10px 24px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">DEAL CARDS (500 Coins)</button>
        </div>
    `;

    window.playBlackjack = function() {
        const bet = Number(document.getElementById("bjBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const playerCard = Math.floor(Math.random() * 6) + 16; // 16-21
        const dealerCard = Math.floor(Math.random() * 7) + 15; // 15-21

        document.getElementById("bjScoreDisplay").innerText = `Player: ${playerCard} | Dealer: ${dealerCard}`;

        if (playerCard > 21) {
            playSound('lose');
            alert(`💥 BUST! You got ${playerCard}`);
        } else if (dealerCard > 21 || playerCard > dealerCard) {
            const won = bet * 2;
            game.balance += won;
            addXP(90);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 WIN! Player (${playerCard}) beat Dealer (${dealerCard}) | Won ₹${won}`);
        } else if (playerCard === dealerCard) {
            game.balance += bet;
            alert(`👔 PUSH/DRAW! Both got ${playerCard}. Bet refunded.`);
        } else {
            playSound('lose');
            alert(`❌ DEALER WINS! Dealer (${dealerCard}) beat Player (${playerCard})`);
        }
        updateBalance();
        saveGame();
    };
})();
