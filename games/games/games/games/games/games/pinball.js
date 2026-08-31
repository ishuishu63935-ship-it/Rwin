/* MODULE: CYBER PINBALL BUMPER (SUPER VIP LEVEL 135) */
(function initPinball() {
    console.log("🎮 Cyber Pinball Loaded!");
    const container = document.getElementById("game-pinball");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🎮 Cyber Pinball Bumper</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 135 Required • Launch Silver Ball into Multiplier Bumpers!</p>
            <div id="pinballDisplay" style="font-size:36px; margin:15px 0; font-weight:800; color:var(--neon-gold); background:#000; padding:15px; border-radius:10px; border:2px solid var(--neon-gold);">⚪ READY TO LAUNCH</div>
            <input type="number" id="pinballBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.launchPinball()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">LAUNCH BALL ⚪ (1000)</button>
        </div>
    `;

    window.launchPinball = function() {
        const bet = Number(document.getElementById("pinballBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const bumpers = [
            { name: "💥 OUTHOLE DRAIN (0X)", multi: 0 },
            { name: "🔴 BUMPER 1.5X", multi: 1.5 },
            { name: "🟣 HYPER BUMPER 3X", multi: 3 },
            { name: "⚡ MULTI-BALL BUMPER 6X", multi: 6 }
        ];

        const res = bumpers[Math.floor(Math.random() * bumpers.length)];
        document.getElementById("pinballDisplay").innerText = res.name;

        if (res.multi > 0) {
            const won = Math.floor(bet * res.multi);
            game.balance += won;
            addXP(220);
            playSound('win');
            if (res.multi >= 3 && typeof confetti === 'function') confetti();
            alert(`🎉 BUMPER HIT! ${res.name} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert("❌ BALL DRAINED IN OUTHOLE!");
        }
        updateBalance();
        saveGame();
    };
})();
