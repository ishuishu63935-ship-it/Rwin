/* MODULE: COIN PUSHER ARCADE (SUPER VIP LEVEL 85) */
(function initCoinPusher() {
    console.log("🪙 Coin Pusher Loaded!");
    const container = document.getElementById("game-coinpusher");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🕹️ Arcade Coin Pusher</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 85 Required • Drop coins into the moving pusher ledge!</p>
            <div id="pusherDisplay" style="font-size:36px; margin:15px 0; font-weight:800; color:var(--neon-gold); background:#000; padding:15px; border-radius:10px; border:2px solid var(--neon-gold);">🪙 🪙 🪙</div>
            <input type="number" id="pusherBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.dropCoinPusher()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">DROP COIN (1000)</button>
        </div>
    `;

    window.dropCoinPusher = function() {
        const bet = Number(document.getElementById("pusherBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const outcomes = [0, 0.5, 1.2, 2.0, 5.0, 12.0];
        const res = outcomes[Math.floor(Math.random() * outcomes.length)];
        const won = Math.floor(bet * res);

        document.getElementById("pusherDisplay").innerText = res > 0 ? `🪙 PUSHED: ${res}X!` : `❌ 0 COINS FELL`;

        if (res >= 1) {
            game.balance += won;
            addXP(180);
            playSound('win');
            if (res >= 5 && typeof confetti === 'function') confetti();
            alert(`🎉 COIN CASCADE! ${res}x | Won ₹${won}`);
        } else {
            playSound('lose');
        }
        updateBalance();
        saveGame();
    };
})();
