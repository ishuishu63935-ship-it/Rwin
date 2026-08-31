/* MODULE: SAMURAI SWORD CLASH (SUPER VIP LEVEL 195) */
(function initSwordClash() {
    console.log("⚔️ Sword Clash Loaded!");
    const container = document.getElementById("game-swordclash");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">⚔️ Samurai Cyber Sword Clash</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 195 Required • Pick High Slash (2X) or Low Parry (2X)!</p>
            <div id="swordDisplay" style="font-size:36px; margin:15px 0;">⚔️ 🥷 ⚔️</div>
            <input type="number" id="swordBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.clashSword('HIGH')" style="padding:10px 18px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">🗡️ HIGH SLASH (2X)</button>
            <button onclick="window.clashSword('LOW')" style="padding:10px 18px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">🛡️ LOW PARRY (2X)</button>
        </div>
    `;

    window.clashSword = function(move) {
        const bet = Number(document.getElementById("swordBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const enemyMove = Math.random() < 0.5 ? "HIGH" : "LOW";

        if (move === enemyMove) {
            const won = bet * 2;
            game.balance += won;
            addXP(230);
            playSound('win');
            document.getElementById("swordDisplay").innerText = "💥 CRITICAL STRIKE HIT!";
            if (typeof confetti === 'function') confetti();
            alert(`🎉 SWORD VICTORY! Won ₹${won}`);
        } else {
            playSound('lose');
            document.getElementById("swordDisplay").innerText = "🛡️ PARRY BLOCKED!";
            alert("❌ MOVE COUNTERED BY ENEMY!");
        }
        updateBalance();
        saveGame();
    };
})();
