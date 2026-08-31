/* MODULE: CYBER BANK HEIST (SUPER VIP LEVEL 225) */
(function initCyberHeist() {
    console.log("🏦 Cyber Heist Loaded!");
    const container = document.getElementById("game-cyberheist");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">🏦 Cyber Bank Safe Heist</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 225 Required • Pick Safe #1, #2, or #3 to loot cash!</p>
            <div id="heistDisplay" style="font-size:45px; margin:15px 0;">🏦 🏦 🏦</div>
            <input type="number" id="heistBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.lootSafe(1)" style="padding:10px 18px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">SAFE 1</button>
            <button onclick="window.lootSafe(2)" style="padding:10px 18px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">SAFE 2</button>
            <button onclick="window.lootSafe(3)" style="padding:10px 18px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">SAFE 3</button>
        </div>
    `;

    window.lootSafe = function(pick) {
        const bet = Number(document.getElementById("heistBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const policePos = Math.floor(Math.random() * 3) + 1;
        let safes = ["💰 CASH", "💰 CASH", "💰 CASH"];
        safes[policePos - 1] = "🚨 POLICE BUST";

        document.getElementById("heistDisplay").innerText = safes.join(" | ");

        if (pick !== policePos) {
            const won = Math.floor(bet * 2.8);
            game.balance += won;
            addXP(280);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 BANK LOOTED! Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ POLICE BUSTED SAFE #${policePos}! Lost loot.`);
        }
        updateBalance();
        saveGame();
    };
})();
