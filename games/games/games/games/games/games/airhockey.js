/* MODULE: CYBER AIR HOCKEY (SUPER VIP LEVEL 160) */
(function initAirHockey() {
    console.log("🏒 Air Hockey Loaded!");
    const container = document.getElementById("game-airhockey");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">🏒 Cyber Air Hockey Strike</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 160 Required • Strike puck past AI Mallet for 3X!</p>
            <div id="puckDisplay" style="font-size:36px; margin:15px 0; background:#0f172a; padding:15px; border-radius:10px;">🏒 🥏 🏒</div>
            <input type="number" id="hockeyBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.strikePuck()" style="padding:10px 24px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; cursor:pointer;">STRIKE PUCK 🥏 (1000)</button>
        </div>
    `;

    window.strikePuck = function() {
        const bet = Number(document.getElementById("hockeyBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const outcomes = [
            { name: "💥 AI BLOCK!", multi: 0 },
            { name: "🥏 RICOCHET GOAL (2.0X)", multi: 2.0 },
            { name: "🔥 POWER SLAPSHOT (3.5X)", multi: 3.5 }
        ];

        const res = outcomes[Math.floor(Math.random() * outcomes.length)];
        document.getElementById("puckDisplay").innerText = res.name;

        if (res.multi > 0) {
            const won = Math.floor(bet * res.multi);
            game.balance += won;
            addXP(220);
            playSound('win');
            if (res.multi >= 3.5 && typeof confetti === 'function') confetti();
            alert(`🎉 GOAL SCORE! ${res.name} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert("❌ SHOT BLOCKED BY AI MALLET!");
        }
        updateBalance();
        saveGame();
    };
})();
