/* MODULE: CYBER ARCHERY TARGET (SUPER VIP LEVEL 115) */
(function initArchery() {
    console.log("🏹 Archery Module Loaded!");
    const container = document.getElementById("game-archery");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🏹 Cyber Archery Target</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 115 Required • Shoot Arrow for up to 10X Bullseye!</p>
            <div id="archeryDisplay" style="font-size:45px; margin:15px 0;">🎯 🏹</div>
            <input type="number" id="archeryBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.releaseArrow()" style="padding:10px 24px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">RELEASE ARROW 🏹 (1000)</button>
        </div>
    `;

    window.releaseArrow = function() {
        const bet = Number(document.getElementById("archeryBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const hits = [
            { name: "💥 WIND DRIFT (MISS!)", multi: 0 },
            { name: "⚪ OUTER RING (1.5X)", multi: 1.5 },
            { name: "🔴 INNER RING (3X)", multi: 3 },
            { name: "🟡 GOLD BULLSEYE (10X)", multi: 10 }
        ];

        const res = hits[Math.floor(Math.random() * hits.length)];
        document.getElementById("archeryDisplay").innerText = res.name;

        if (res.multi > 0) {
            const won = Math.floor(bet * res.multi);
            game.balance += won;
            addXP(200);
            playSound('win');
            if (res.multi >= 3 && typeof confetti === 'function') confetti();
            alert(`🎉 ARCHERY SHOT! ${res.name} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert("❌ ARROW MISSED TARGET!");
        }
        updateBalance();
        saveGame();
    };
})();
