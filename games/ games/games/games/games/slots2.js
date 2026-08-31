/* MODULE: MEGA DIAMOND SLOTS (SUPER VIP LEVEL 15) */
(function initSlots2() {
    console.log("💎 Mega Slots Loaded!");
    const container = document.getElementById("game-slots2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">💎 Mega Diamond 5-Reel Slots</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 15 Required • High-Payout Jackpot!</p>
            <div style="font-size:32px; background:#000; padding:15px; border-radius:10px; border:2px solid var(--neon-gold); margin:15px 0;" id="s2Display">💎 💎 👑 7️⃣ 💎</div>
            <input type="number" id="s2Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playSlots2()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">SPIN 5-REEL (500)</button>
        </div>
    `;

    window.playSlots2 = function() {
        const bet = Number(document.getElementById("s2Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const icons = ["💎", "👑", "7️⃣", "🔥", "🎰"];
        const r = [
            icons[Math.floor(Math.random() * icons.length)],
            icons[Math.floor(Math.random() * icons.length)],
            icons[Math.floor(Math.random() * icons.length)],
            icons[Math.floor(Math.random() * icons.length)],
            icons[Math.floor(Math.random() * icons.length)]
        ];

        document.getElementById("s2Display").innerText = r.join(" ");

        const matches = r.filter((item, index) => r.indexOf(item) !== index).length;
        if (matches >= 3) {
            const won = bet * 10; game.balance += won; addXP(200); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 5-REEL MEGA JACKPOT! Won ₹${won}`);
        } else if (matches >= 1) {
            const won = bet * 2; game.balance += won; addXP(70); playSound('win');
            alert(`🎉 REEL MATCH! Won ₹${won}`);
        } else {
            playSound('lose');
        }
        updateBalance(); saveGame();
    };
})();
