/* MODULE: RETRO SPACE SHOOTER (SUPER VIP LEVEL 230) */
(function initSpaceInvader() {
    console.log("👾 Space Shooter Loaded!");
    const container = document.getElementById("game-spaceinvader");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">👾 Retro Cyber Space Shooter</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 230 Required • Blast alien mothership for 15X Grand Jackpot!</p>
            <div id="invaderDisplay" style="font-size:36px; margin:15px 0;">🚀 👾 👾</div>
            <input type="number" id="invaderBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.shootInvader()" style="padding:10px 24px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">FIRE LASER CANNON 🚀 (1000)</button>
        </div>
    `;

    window.shootInvader = function() {
        const bet = Number(document.getElementById("invaderBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const targets = [
            { name: "💥 LASER MISSED!", multi: 0 },
            { name: "👾 ALIEN SCOUT (1.5X)", multi: 1.5 },
            { name: "🛸 MOTHERSHIP HIT (4.0X)", multi: 4.0 },
            { name: "🌟 GRAND SPACE JACKPOT (15X)", multi: 15 }
        ];

        const res = targets[Math.floor(Math.random() * targets.length)];
        document.getElementById("invaderDisplay").innerText = res.name;

        if (res.multi > 0) {
            const won = Math.floor(bet * res.multi);
            game.balance += won;
            addXP(300);
            playSound('win');
            if (res.multi >= 4.0 && typeof confetti === 'function') confetti();
            alert(`🎉 SPACE VICTORY! ${res.name} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert("❌ SHOT MISSED ALIEN FLEET!");
        }
        updateBalance();
        saveGame();
    };
})();
