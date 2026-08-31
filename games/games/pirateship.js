/* MODULE: PIRATE SHIP CANNON (SUPER VIP LEVEL 215) */
(function initPirateShip() {
    console.log("🏴‍☠️ Pirate Ship Loaded!");
    const container = document.getElementById("game-pirateship");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🏴‍☠️ Pirate Ship Cannon Blast</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 215 Required • Blast enemy galleon for up to 10X Treasure!</p>
            <div id="cannonDisplay" style="font-size:45px; margin:15px 0;">💣 🏴‍☠️</div>
            <input type="number" id="pirateBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.fireCannon()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">FIRE CANNON 💣 (1000)</button>
        </div>
    `;

    window.fireCannon = function() {
        const bet = Number(document.getElementById("pirateBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const hits = [
            { name: "💥 CANNON MISSED!", multi: 0 },
            { name: "⛵ DECK HIT (1.8X)", multi: 1.8 },
            { name: "⚓ HULL SUNK (3.5X)", multi: 3.5 },
            { name: "👑 TREASURE CHEST HIT (10X)", multi: 10 }
        ];

        const res = hits[Math.floor(Math.random() * hits.length)];
        document.getElementById("cannonDisplay").innerText = res.name;

        if (res.multi > 0) {
            const won = Math.floor(bet * res.multi);
            game.balance += won;
            addXP(260);
            playSound('win');
            if (res.multi >= 3.5 && typeof confetti === 'function') confetti();
            alert(`🎉 SHIP SUNK! ${res.name} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert("❌ CANNONBALL MISSED!");
        }
        updateBalance();
        saveGame();
    };
})();
      
