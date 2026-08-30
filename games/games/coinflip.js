/* MODULE: CYBER COIN FLIP */
(function initCoinFlip() {
    console.log("🪙 Coin Flip Module Loaded!");
    const container = document.getElementById("game-coinflip");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🪙 Cyber Coin Flip</h2>
            <p style="font-size:11px; color:#94a3b8;">Instant 50/50 Heads or Tails!</p>
            <div id="coinDisplay" style="font-size:55px; margin:15px 0;">🪙</div>
            <input type="number" id="coinBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playCoinFlip('HEADS')" style="padding:10px 20px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">HEADS (2X)</button>
            <button onclick="window.playCoinFlip('TAILS')" style="padding:10px 20px; background:#8b5cf6; color:#fff; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">TAILS (2X)</button>
        </div>
    `;

    window.playCoinFlip = function(choice) {
        const bet = Number(document.getElementById("coinBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const result = Math.random() < 0.5 ? "HEADS" : "TAILS";
        document.getElementById("coinDisplay").innerText = result === "HEADS" ? "👑" : "⚡";

        if (choice === result) {
            const won = bet * 2;
            game.balance += won;
            addXP(60);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 FLIP WIN! Result: ${result} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ LOST! Result: ${result}`);
        }
        updateBalance();
        saveGame();
    };
})();
