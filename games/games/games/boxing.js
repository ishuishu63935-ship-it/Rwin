/* MODULE: CYBER KNOCKOUT PUNCH (SUPER VIP LEVEL 170) */
(function initBoxing() {
    console.log("🥊 Boxing Loaded!");
    const container = document.getElementById("game-boxing");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">🥊 Cyber KO Boxing Punch</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 170 Required • Land Jab, Hook or Uppercut for KO!</p>
            <div id="boxingDisplay" style="font-size:36px; margin:15px 0;">🥊 🤖 🥊</div>
            <input type="number" id="boxingBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.punchKO(1)" style="padding:10px 14px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">🥊 JAB (1.5X)</button>
            <button onclick="window.punchKO(2)" style="padding:10px 14px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">🥊 HOOK (3X)</button>
            <button onclick="window.punchKO(3)" style="padding:10px 14px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">💥 UPPERCUT (6X)</button>
        </div>
    `;

    window.punchKO = function(type) {
        const bet = Number(document.getElementById("boxingBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const multis = [0, 1.5, 3.0, 6.0];
        const isBlocked = Math.random() < 0.35;

        if (!isBlocked) {
            const won = Math.floor(bet * multis[type]);
            game.balance += won;
            addXP(240);
            playSound('win');
            document.getElementById("boxingDisplay").innerText = "💥 KNOCKOUT HIT!";
            if (multis[type] >= 3 && typeof confetti === 'function') confetti();
            alert(`🎉 KO LANDED! Won ₹${won}`);
        } else {
            playSound('lose');
            document.getElementById("boxingDisplay").innerText = "🛡️ BLOCKED BY OPPONENT!";
            alert("❌ PUNCH BLOCKED!");
        }
        updateBalance();
        saveGame();
    };
})();
