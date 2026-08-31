/* MODULE: ALIEN UFO BEAM (SUPER VIP LEVEL 205) */
(function initAlienAbduction() {
    console.log("🛸 Alien Abduction Loaded!");
    const container = document.getElementById("game-alienabduction");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">🛸 Alien UFO Beam Abduction</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 205 Required • Abduct cows or gems for up to 12X multiplier!</p>
            <div id="ufoDisplay" style="font-size:45px; margin:15px 0;">🛸 🐄</div>
            <input type="number" id="ufoBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.beamAbduct()" style="padding:10px 24px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; cursor:pointer;">FIRE UFO BEAM 🛸 (1000)</button>
        </div>
    `;

    window.beamAbduct = function() {
        const bet = Number(document.getElementById("ufoBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const targets = [
            { name: "💥 BEAM MISSED!", multi: 0 },
            { name: "🐄 COW ABDUCTED (1.8X)", multi: 1.8 },
            { name: "🛸 ALIEN SHIP REFUEL (3.5X)", multi: 3.5 },
            { name: "💎 SPACE CRYSTAL (12X)", multi: 12 }
        ];

        const res = targets[Math.floor(Math.random() * targets.length)];
        document.getElementById("ufoDisplay").innerText = res.name;

        if (res.multi > 0) {
            const won = Math.floor(bet * res.multi);
            game.balance += won;
            addXP(250);
            playSound('win');
            if (res.multi >= 3.5 && typeof confetti === 'function') confetti();
            alert(`🎉 ABDUCTION SUCCESS! ${res.name} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert("❌ BEAM MISSED TARGET!");
        }
        updateBalance();
        saveGame();
    };
})();
