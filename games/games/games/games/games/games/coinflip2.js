/* MODULE: ULTIMATE COIN FLIP (SUPER VIP LEVEL 60) */
(function initCoinflip2() {
    console.log("🪙 Ultimate Coinflip Loaded!");
    const container = document.getElementById("game-coinflip2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🪙 Ultimate Double Coinflip</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 60 Required • Double Heads for 4X Payout!</p>
            <div id="cf2Display" style="font-size:45px; margin:15px 0;">🪙 🪙</div>
            <input type="number" id="cf2Bet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playCoinflip2()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">FLIP DUAL COINS (1000)</button>
        </div>
    `;

    window.playCoinflip2 = function() {
        const bet = Number(document.getElementById("cf2Bet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const c1 = Math.random() < 0.5 ? "👑" : "⚡";
        const c2 = Math.random() < 0.5 ? "👑" : "⚡";

        document.getElementById("cf2Display").innerText = `${c1} ${c2}`;

        if (c1 === "👑" && c2 === "👑") {
            const won = bet * 4; game.balance += won; addXP(220); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 DOUBLE HEADS HIT! 4X | Won ₹${won}`);
        } else if (c1 === "👑" || c2 === "👑") {
            const won = Math.floor(bet * 1.2); game.balance += won; addXP(60); playSound('win');
            alert(`🎉 SINGLE HEAD MATCH! Won ₹${won}`);
        } else {
            playSound('lose'); alert("❌ TAILS HIT!");
        }
        updateBalance(); saveGame();
    };
})();
