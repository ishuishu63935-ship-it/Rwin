/* MODULE: 3-VAULT GOLD KEYS (SUPER VIP LEVEL 125) */
(function initTreasureChest() {
    console.log("🔑 Treasure Chest Loaded!");
    const container = document.getElementById("game-treasurechest");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🔑 3-Vault Gold Keys</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 125 Required • Pick 1 Key to open Gold Vault!</p>
            <div id="chestKeyDisplay" style="font-size:45px; margin:15px 0;">🔑 🔑 🔑</div>
            <input type="number" id="chestKeyBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.useKey(1)" style="padding:10px 18px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">KEY #1</button>
            <button onclick="window.useKey(2)" style="padding:10px 18px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">KEY #2</button>
            <button onclick="window.useKey(3)" style="padding:10px 18px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">KEY #3</button>
        </div>
    `;

    window.useKey = function(keyPick) {
        const bet = Number(document.getElementById("chestKeyBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const goldKeyPos = Math.floor(Math.random() * 3) + 1;
        let keys = ["🗝️ RUSTY", "🗝️ RUSTY", "🗝️ RUSTY"];
        keys[goldKeyPos - 1] = "👑 GOLD VAULT (4X)";

        document.getElementById("chestKeyDisplay").innerText = keys.join(" | ");

        if (keyPick === goldKeyPos) {
            const won = bet * 4;
            game.balance += won;
            addXP(240);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 GOLD VAULT UNLOCKED! Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ BROKEN KEY! Gold Key was #${goldKeyPos}`);
        }
        updateBalance();
        saveGame();
    };
})();
