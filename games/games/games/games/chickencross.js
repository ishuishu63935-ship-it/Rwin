/* MODULE: CHICKEN ROAD CROSS (SUPER VIP LEVEL 75) */
(function initChickenCross() {
    console.log("🐔 Chicken Cross Loaded!");
    const container = document.getElementById("game-chickencross");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🐔 Chicken Road Cross</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 75 Required • Cross traffic lanes to stack multipliers!</p>
            <div id="chickenDisplay" style="font-size:24px; margin:15px 0; font-weight:800; color:var(--neon-gold); background:#0f172a; padding:15px; border-radius:10px;">Lane 0/4 • Multiplier: 1.0x 🐔</div>
            <input type="number" id="chickenBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button id="stepChickenBtn" onclick="window.stepChicken()" style="padding:10px 20px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">CROSS LANE 🚗</button>
            <button id="cashChickenBtn" onclick="window.cashChicken()" style="padding:10px 20px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer; display:none;">💰 CASHOUT NOW</button>
        </div>
    `;

    let currentLane = 0, betAmt = 0;
    const multipliers = [1.0, 1.5, 2.5, 4.5, 10.0];

    window.stepChicken = function() {
        if (currentLane === 0) {
            betAmt = Number(document.getElementById("chickenBet").value) || 1000;
            if (game.balance < betAmt) return alert("Low Balance!");
            game.balance -= betAmt;
            updateBalance();
        }

        const isHit = Math.random() < 0.25; // 25% crash chance
        if (isHit) {
            playSound('lose');
            document.getElementById("chickenDisplay").innerText = "💥 CRASHED BY CAR! 🚗💥";
            alert("💥 CRASHED! Chicken got hit by a car.");
            currentLane = 0;
            document.getElementById("cashChickenBtn").style.display = "none";
        } else {
            currentLane++;
            const multi = multipliers[currentLane];
            document.getElementById("chickenDisplay").innerText = `Lane ${currentLane}/4 • Multiplier: ${multi}x 🐔`;
            document.getElementById("cashChickenBtn").style.display = "inline-block";
            document.getElementById("cashChickenBtn").innerText = `💰 CASHOUT (₹${Math.floor(betAmt * multi)})`;
            playSound('win');

            if (currentLane >= 4) {
                window.cashChicken();
            }
        }
    };

    window.cashChicken = function() {
        if (currentLane === 0) return;
        const won = Math.floor(betAmt * multipliers[currentLane]);
        game.balance += won;
        addXP(200);
        updateBalance();
        saveGame();
        playSound('win');
        if (typeof confetti === 'function') confetti();
        alert(`🎉 SAFE CROSSING! Cashed out at ${multipliers[currentLane]}x | Won ₹${won}`);
        currentLane = 0;
        document.getElementById("chickenDisplay").innerText = "Lane 0/4 • Multiplier: 1.0x 🐔";
        document.getElementById("cashChickenBtn").style.display = "none";
    };
})();
