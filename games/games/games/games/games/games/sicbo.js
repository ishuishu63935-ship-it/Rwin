/* MODULE: CYBER SIC BO DICE (SUPER VIP LEVEL 7) */
(function initSicbo() {
    console.log("🎲 Sic Bo Module Loaded!");
    const container = document.getElementById("game-sicbo");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🎲 Cyber Sic Bo 3-Dice</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 7 Required • Bet SMALL (4-10) or BIG (11-17)!</p>
            <div id="sicDisplay" style="font-size:36px; margin:15px 0;">🎲 🎲 🎲</div>
            <input type="number" id="sicBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playSicbo('SMALL')" style="padding:10px 18px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">SMALL 4-10 (2X)</button>
            <button onclick="window.playSicbo('BIG')" style="padding:10px 18px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">BIG 11-17 (2X)</button>
        </div>
    `;

    window.playSicbo = function(choice) {
        const bet = Number(document.getElementById("sicBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const d3 = Math.floor(Math.random() * 6) + 1;
        const total = d1 + d2 + d3;

        document.getElementById("sicDisplay").innerText = `[${d1}] [${d2}] [${d3}] = ${total}`;

        const resultType = total <= 10 ? "SMALL" : "BIG";
        if (choice === resultType) {
            const won = bet * 2; game.balance += won; addXP(90); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 SIC BO WIN! Total: ${total} (${resultType}) | Won ₹${won}`);
        } else {
            playSound('lose'); alert(`❌ LOST! Total was ${total} (${resultType})`);
        }
        updateBalance(); saveGame();
    };
})();
