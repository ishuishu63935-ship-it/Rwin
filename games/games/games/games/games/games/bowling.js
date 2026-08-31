/* MODULE: CYBER BOWLING STRIKE (SUPER VIP LEVEL 110) */
(function initBowling() {
    console.log("🎳 Cyber Bowling Loaded!");
    const container = document.getElementById("game-bowling");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🎳 Cyber Bowling Strike</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 110 Required • Hit a Strike for 5X Payout!</p>
            <div id="bowlingDisplay" style="font-size:36px; margin:15px 0;">🎳 🎳 🎳</div>
            <input type="number" id="bowlingBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.rollBowlingBall()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">ROLL BALL 🎳 (1000)</button>
        </div>
    `;

    window.rollBowlingBall = function() {
        const bet = Number(document.getElementById("bowlingBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const outcomes = [
            { name: "💥 GUTTER BALL!", multi: 0 },
            { name: "🎳 5 PINS HIT (1.2X)", multi: 1.2 },
            { name: "🎳 8 PINS HIT (2.0X)", multi: 2.0 },
            { name: "🔥 STRIKE!! (5.0X)", multi: 5.0 }
        ];

        const res = outcomes[Math.floor(Math.random() * outcomes.length)];
        document.getElementById("bowlingDisplay").innerText = res.name;

        if (res.multi > 0) {
            const won = Math.floor(bet * res.multi);
            game.balance += won;
            addXP(200);
            playSound('win');
            if (res.multi >= 5 && typeof confetti === 'function') confetti();
            alert(`🎉 BOWLING SCORE! ${res.name} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert("❌ GUTTER BALL! Zero pins knocked down.");
        }
        updateBalance();
        saveGame();
    };
})();
