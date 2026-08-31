/* MODULE: 3-CUP MAGIC SHELL (SUPER VIP LEVEL 100) */
(function initShellGame() {
    console.log("🥤 Shell Game Loaded!");
    const container = document.getElementById("game-shellgame");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">🥤 3-Cup Magic Shell</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 100 Required • Find the Hidden Golden Pearl!</p>
            <div id="shellDisplay" style="font-size:45px; margin:15px 0;">🥤 🥤 🥤</div>
            <input type="number" id="shellBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.pickShell(1)" style="padding:10px 18px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">CUP 1</button>
            <button onclick="window.pickShell(2)" style="padding:10px 18px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">CUP 2</button>
            <button onclick="window.pickShell(3)" style="padding:10px 18px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">CUP 3</button>
        </div>
    `;

    window.pickShell = function(pick) {
        const bet = Number(document.getElementById("shellBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const pearlPos = Math.floor(Math.random() * 3) + 1;
        let cups = ["🥤", "🥤", "🥤"];
        cups[pearlPos - 1] = "🔮 PEARL";

        document.getElementById("shellDisplay").innerText = cups.join(" | ");

        if (pick === pearlPos) {
            const won = bet * 3;
            game.balance += won;
            addXP(220);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 PEARL REVEALED! Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ EMPTY CUP! Pearl was under Cup ${pearlPos}`);
        }
        updateBalance();
        saveGame();
    };
})();
