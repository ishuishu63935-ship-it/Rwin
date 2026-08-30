/* MODULE: TREASURE CHEST VAULT */
(function initMines2() {
    console.log("👑 Chest Vault Module Loaded!");
    const container = document.getElementById("game-mines2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">👑 Treasure Chest Vault</h2>
            <p style="font-size:11px; color:#94a3b8;">Pick Chests to collect Gold Coins • Avoid Traps!</p>
            <div id="chestDisplay" style="font-size:36px; margin:15px 0;">🎁 🎁 🎁 🎁</div>
            <input type="number" id="chestBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playChest()" style="padding:10px 24px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">OPEN CHEST (500 Coins)</button>
        </div>
    `;

    window.playChest = function() {
        const bet = Number(document.getElementById("chestBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const outcomes = ["👑 GOLD VAULT (5X)", "💎 DIAMOND (2X)", "💰 COINS (1.5X)", "💥 TRAP BOMB (0X)"];
        const res = outcomes[Math.floor(Math.random() * outcomes.length)];

        document.getElementById("chestDisplay").innerText = res;

        if (res.includes("5X")) {
            const won = bet * 5;
            game.balance += won;
            addXP(150);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 JACKPOT CHEST! Won ₹${won}`);
        } else if (res.includes("2X") || res.includes("1.5X")) {
            const multi = res.includes("2X") ? 2 : 1.5;
            const won = Math.floor(bet * multi);
            game.balance += won;
            addXP(70);
            playSound('win');
            alert(`🎉 CHEST WIN! Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ TRAP HIT! Lost bet.`);
        }
        updateBalance();
        saveGame();
    };
})();
