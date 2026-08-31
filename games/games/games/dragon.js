/* MODULE: DRAGON TIGER SPEED (SUPER VIP LEVEL 2) */
(function initDragon() {
    console.log("🐉 Dragon Tiger Module Loaded!");
    const container = document.getElementById("game-dragon");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🐉 Dragon vs Tiger 🐅</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 2 Required • Pick Dragon (2X) or Tiger (2X)!</p>
            <div id="dtDisplay" style="font-size:26px; margin:15px 0; font-weight:800; color:var(--neon-gold);">Dragon: 0 | Tiger: 0</div>
            <input type="number" id="dtBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playDragon('DRAGON')" style="padding:10px 18px; background:#ef4444; color:#fff; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">🐉 DRAGON (2X)</button>
            <button onclick="window.playDragon('TIGER')" style="padding:10px 18px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">🐅 TIGER (2X)</button>
        </div>
    `;

    window.playDragon = function(choice) {
        const bet = Number(document.getElementById("dtBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const dCard = Math.floor(Math.random() * 13) + 1;
        const tCard = Math.floor(Math.random() * 13) + 1;
        document.getElementById("dtDisplay").innerText = `Dragon: ${dCard} | Tiger: ${tCard}`;

        let winner = dCard > tCard ? "DRAGON" : (tCard > dCard ? "TIGER" : "TIE");
        if (choice === winner) {
            const won = bet * 2; game.balance += won; addXP(80); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 ${winner} WINS! Won ₹${won}`);
        } else if (winner === "TIE") {
            game.balance += bet; alert("👔 TIE! Bet Refunded.");
        } else {
            playSound('lose'); alert(`❌ LOST! Winner was ${winner}`);
        }
        updateBalance(); saveGame();
    };
})();
