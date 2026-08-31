/* MODULE: MEGA PLINKO 50X (SUPER VIP LEVEL 22) */
(function initPlinko2() {
    console.log("🟢 Mega Plinko Loaded!");
    const container = document.getElementById("game-plinko2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">🟢 Mega Plinko 50X Drop</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 22 Required • High Volatility Drop!</p>
            <div id="p2Display" style="font-size:45px; margin:15px 0;">🎯</div>
            <input type="number" id="p2Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playPlinko2()" style="padding:10px 24px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">DROP BALL (500)</button>
        </div>
    `;

    window.playPlinko2 = function() {
        const bet = Number(document.getElementById("p2Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const multis = [0.1, 0.5, 2.0, 5.0, 15.0, 50.0];
        const res = multis[Math.floor(Math.random() * multis.length)];
        const won = Math.floor(bet * res);

        document.getElementById("p2Display").innerText = `🎯 ${res}X`;

        if (res >= 1) {
            game.balance += won; addXP(120); playSound('win');
            if (res >= 15 && typeof confetti === 'function') confetti();
            alert(`🎉 MEGA PLINKO WIN! Multiplier ${res}x | Won ₹${won}`);
        } else {
            playSound('lose'); alert(`❌ Multiplier ${res}x | Won ₹${won}`);
        }
        updateBalance(); saveGame();
    };
})();
