/* MODULE: NEON DARTS BULLSEYE (SUPER VIP LEVEL 95) */
(function initDarts() {
    console.log("🎯 Neon Darts Loaded!");
    const container = document.getElementById("game-darts");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🎯 Neon Darts Target</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 95 Required • Hit Bullseye for 10X Jackpot!</p>
            <div id="dartDisplay" style="font-size:45px; margin:15px 0;">🎯</div>
            <input type="number" id="dartBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.throwDart()" style="padding:10px 24px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">THROW DART 🎯 (1000)</button>
        </div>
    `;

    window.throwDart = function() {
        const bet = Number(document.getElementById("dartBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const zones = [
            { name: "💥 MISS!", multi: 0 },
            { name: "🔴 OUTER RING (1.5X)", multi: 1.5 },
            { name: "🟢 INNER RING (3X)", multi: 3 },
            { name: "🎯 BULLSEYE JACKPOT (10X)", multi: 10 }
        ];

        const res = zones[Math.floor(Math.random() * zones.length)];
        document.getElementById("dartDisplay").innerText = res.name;

        if (res.multi > 0) {
            const won = Math.floor(bet * res.multi);
            game.balance += won;
            addXP(180);
            playSound('win');
            if (res.multi >= 3 && typeof confetti === 'function') confetti();
            alert(`🎉 DART WIN! Hit ${res.name} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert("❌ DART MISSED TARGET!");
        }
        updateBalance();
        saveGame();
    };
})();
