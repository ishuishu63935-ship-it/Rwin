/* MODULE: CYBER JACKPOT 1000X (SUPER VIP LEVEL 40) */
(function initJackpot() {
    console.log("🎰 Cyber Jackpot Loaded!");
    const container = document.getElementById("game-jackpot");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🎰 Cyber Jackpot 1000X</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 40 Required • Ultra High Limit Jackpot!</p>
            <div id="jpDisplay" style="font-size:36px; margin:15px 0; font-weight:800; color:var(--neon-gold);">👑 👑 👑</div>
            <input type="number" id="jpBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playJackpot()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">SPIN JACKPOT (1000)</button>
        </div>
    `;

    window.playJackpot = function() {
        const bet = Number(document.getElementById("jpBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const symbols = ["👑", "💎", "7️⃣", "🔥", "⚡"];
        const s1 = symbols[Math.floor(Math.random() * symbols.length)];
        const s2 = symbols[Math.floor(Math.random() * symbols.length)];
        const s3 = symbols[Math.floor(Math.random() * symbols.length)];

        document.getElementById("jpDisplay").innerText = `${s1} ${s2} ${s3}`;

        if (s1 === s2 && s2 === s3) {
            const won = bet * 100; game.balance += won; addXP(300); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 ULTRA JACKPOT HIT! Won ₹${won}`);
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            const won = bet * 2; game.balance += won; addXP(90); playSound('win');
            alert(`🎉 DOUBLE MATCH! Won ₹${won}`);
        } else {
            playSound('lose');
        }
        updateBalance(); saveGame();
    };
})();
  
