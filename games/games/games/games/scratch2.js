/* MODULE: DIAMOND SCRATCH (SUPER VIP LEVEL 50) */
(function initScratch2() {
    console.log("🎟️ Diamond Scratch Loaded!");
    const container = document.getElementById("game-scratch2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🎟️ Diamond VIP Scratch Card</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 50 Required • Reveal Diamond VIP Sets!</p>
            <div id="sc2Display" style="font-size:36px; margin:15px 0; font-weight:800; color:var(--neon-blue);">[❓] [❓] [❓] [❓]</div>
            <input type="number" id="sc2Bet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playScratch2()" style="padding:10px 24px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">SCRATCH TICKET (1000)</button>
        </div>
    `;

    window.playScratch2 = function() {
        const bet = Number(document.getElementById("sc2Bet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const items = ["💎", "👑", "🔥", "⚡"];
        const res = [
            items[Math.floor(Math.random() * items.length)],
            items[Math.floor(Math.random() * items.length)],
            items[Math.floor(Math.random() * items.length)],
            items[Math.floor(Math.random() * items.length)]
        ];

        document.getElementById("sc2Display").innerText = res.join(" ");

        const matches = res.filter((item, index) => res.indexOf(item) !== index).length;
        if (matches >= 3) {
            const won = bet * 15; game.balance += won; addXP(250); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 QUAD MATCH SCRATCH! Won ₹${won}`);
        } else if (matches >= 1) {
            const won = bet * 2; game.balance += won; addXP(80); playSound('win');
            alert(`🎉 DOUBLE MATCH! Won ₹${won}`);
        } else {
            playSound('lose');
        }
        updateBalance(); saveGame();
    };
})();
