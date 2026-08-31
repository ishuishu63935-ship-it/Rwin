/* MODULE: CYBER BALLOON PUMP (SUPER VIP LEVEL 105) */
(function initBalloon() {
    console.log("🎈 Balloon Pump Loaded!");
    const container = document.getElementById("game-balloon");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">🎈 Cyber Balloon Pump</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 105 Required • Pump to increase multiplier! Cashout before POP!</p>
            <div id="balloonDisplay" style="font-size:45px; margin:15px 0; font-weight:800; color:var(--neon-green);">🎈 1.0x</div>
            <input type="number" id="balloonBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button id="pumpBtn" onclick="window.pumpBalloon()" style="padding:10px 20px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">PUMP 🎈</button>
            <button id="cashBalloonBtn" onclick="window.cashBalloon()" style="padding:10px 20px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer; display:none;">💰 CASHOUT</button>
        </div>
    `;

    let pumpLevel = 0, betAmt = 0;
    const multipliers = [1.0, 1.4, 2.0, 3.5, 6.0, 12.0, 25.0];

    window.pumpBalloon = function() {
        if (pumpLevel === 0) {
            betAmt = Number(document.getElementById("balloonBet").value) || 1000;
            if (game.balance < betAmt) return alert("Low Balance!");
            game.balance -= betAmt;
            updateBalance();
        }

        const popped = Math.random() < 0.25; // 25% pop chance
        if (popped) {
            playSound('lose');
            document.getElementById("balloonDisplay").innerText = "💥 POPPED!";
            alert("💥 POP! The balloon burst.");
            pumpLevel = 0;
            document.getElementById("cashBalloonBtn").style.display = "none";
        } else {
            pumpLevel++;
            const multi = multipliers[pumpLevel];
            document.getElementById("balloonDisplay").innerText = `🎈 ${multi}x`;
            document.getElementById("cashBalloonBtn").style.display = "inline-block";
            document.getElementById("cashBalloonBtn").innerText = `💰 CASHOUT (₹${Math.floor(betAmt * multi)})`;
            playSound('win');

            if (pumpLevel >= 6) {
                window.cashBalloon();
            }
        }
    };

    window.cashBalloon = function() {
        if (pumpLevel === 0) return;
        const won = Math.floor(betAmt * multipliers[pumpLevel]);
        game.balance += won;
        addXP(250);
        updateBalance();
        saveGame();
        playSound('win');
        if (typeof confetti === 'function') confetti();
        alert(`🎉 BALLOON CASHOUT! ${multipliers[pumpLevel]}x | Won ₹${won}`);
        pumpLevel = 0;
        document.getElementById("balloonDisplay").innerText = "🎈 1.0x";
        document.getElementById("cashBalloonBtn").style.display = "none";
    };
})();
