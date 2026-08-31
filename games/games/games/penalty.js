/* MODULE: PENALTY SHOOTOUT (SUPER VIP LEVEL 70) */
(function initPenalty() {
    console.log("⚽ Penalty Shootout Module Loaded!");
    const container = document.getElementById("game-penalty");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">⚽ Cyber Penalty Shootout</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 70 Required • Shoot past Keeper for 2.5X Payout!</p>
            <div id="penaltyGoal" style="background:#022c22; border:3px solid #10b981; border-radius:12px; padding:20px; margin:15px 0;">
                <div id="keeperStatus" style="font-size:35px; margin-bottom:10px;">🧤 🏃 🧤</div>
                <div style="display:flex; justify-content:center; gap:8px;">
                    <button onclick="window.shootPenalty(1)" style="padding:8px 12px; background:#0f172a; color:#fff; border:1px solid var(--neon-blue); border-radius:6px; cursor:pointer;">↖️ Top Left</button>
                    <button onclick="window.shootPenalty(2)" style="padding:8px 12px; background:#0f172a; color:#fff; border:1px solid var(--neon-blue); border-radius:6px; cursor:pointer;">⬆️ Center</button>
                    <button onclick="window.shootPenalty(3)" style="padding:8px 12px; background:#0f172a; color:#fff; border:1px solid var(--neon-blue); border-radius:6px; cursor:pointer;">↗️ Top Right</button>
                </div>
            </div>
            <input type="number" id="penaltyBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
        </div>
    `;

    window.shootPenalty = function(spot) {
        const bet = Number(document.getElementById("penaltyBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const keeperDive = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        const statusEl = document.getElementById("keeperStatus");

        if (spot === keeperDive) {
            statusEl.innerText = "❌ SAVED BY KEEPER! 🧤";
            playSound('lose');
            alert("❌ SAVED! Keeper blocked your shot!");
        } else {
            statusEl.innerText = "⚽ GOALLLLL! 🕸️";
            const won = Math.floor(bet * 2.5);
            game.balance += won;
            addXP(180);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 GOAL SCORE! Beat Keeper | Won ₹${won}`);
        }
        updateBalance();
        saveGame();
    };
})();
