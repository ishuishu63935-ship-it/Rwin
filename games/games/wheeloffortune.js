/* MODULE: CYBER FORTUNE SPIN (SUPER VIP LEVEL 140) */
(function initWheelOfFortune() {
    console.log("🎡 Fortune Spin Loaded!");
    const container = document.getElementById("game-wheeloffortune");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🎡 Cyber Fortune Mega Spin</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 140 Required • Spin for Multi-tier Jackpot Payouts!</p>
            <div id="fortuneDisplay" style="font-size:36px; margin:15px 0; font-weight:800; color:var(--neon-gold); background:#000; padding:15px; border-radius:10px; border:2px solid var(--neon-gold);">🌟 READY TO SPIN</div>
            <input type="number" id="fortuneBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.spinFortuneWheel()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">SPIN FORTUNE 🎡 (1000)</button>
        </div>
    `;

    window.spinFortuneWheel = function() {
        const bet = Number(document.getElementById("fortuneBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const tiers = [
            { name: "💥 BANKRUPT (0X)", multi: 0 },
            { name: "🥉 BRONZE TIER (1.8X)", multi: 1.8 },
            { name: "🥈 SILVER TIER (3.5X)", multi: 3.5 },
            { name: "🥇 GOLD TIER (8.0X)", multi: 8 },
            { name: "💎 DIAMOND JACKPOT (25X)", multi: 25 }
        ];

        const res = tiers[Math.floor(Math.random() * tiers.length)];
        document.getElementById("fortuneDisplay").innerText = res.name;

        if (res.multi > 0) {
            const won = Math.floor(bet * res.multi);
            game.balance += won;
            addXP(250);
            playSound('win');
            if (res.multi >= 8 && typeof confetti === 'function') confetti();
            alert(`🎉 FORTUNE WIN! Hit ${res.name} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert("❌ BANKRUPT! Zero payout.");
        }
        updateBalance();
        saveGame();
    };
})();
