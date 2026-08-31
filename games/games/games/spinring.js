/* MODULE: NEON RING LOCK (SUPER VIP LEVEL 120) */
(function initSpinRing() {
    console.log("⭕ Spin Ring Loaded!");
    const container = document.getElementById("game-spinring");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">⭕ Neon Ring Lock</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 120 Required • Align rotating rings to crack vault!</p>
            <div id="ringDisplay" style="font-size:40px; margin:15px 0; font-weight:800; color:var(--neon-pink);">⭕ ⭕ ⭕</div>
            <input type="number" id="ringBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.alignRings()" style="padding:10px 24px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; cursor:pointer;">LOCK RINGS ⭕ (1000)</button>
        </div>
    `;

    window.alignRings = function() {
        const bet = Number(document.getElementById("ringBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const symbols = ["🔴", "🟢", "🟡", "🟣"];
        const r1 = symbols[Math.floor(Math.random() * symbols.length)];
        const r2 = symbols[Math.floor(Math.random() * symbols.length)];
        const r3 = symbols[Math.floor(Math.random() * symbols.length)];

        document.getElementById("ringDisplay").innerText = `${r1} ${r2} ${r3}`;

        if (r1 === r2 && r2 === r3) {
            const won = bet * 8;
            game.balance += won;
            addXP(220);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 PERFECT RING LOCK! 8X | Won ₹${won}`);
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            const won = Math.floor(bet * 1.8);
            game.balance += won;
            addXP(80);
            playSound('win');
            alert(`🎉 DUAL RING ALIGNED! Won ₹${won}`);
        } else {
            playSound('lose');
            alert("❌ MISALIGNED RINGS!");
        }
        updateBalance();
        saveGame();
    };
})();
