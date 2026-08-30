/* MODULE: SPACE DASH CRASH */
(function initCrash2() {
    console.log("🚀 Space Dash Module Loaded!");
    const container = document.getElementById("game-crash2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">🛸 Space Dash Multiplier</h2>
            <p style="font-size:11px; color:#94a3b8;">High Multiplier Rush • Tap Cash Out Before Rocket Explodes!</p>
            <div id="dashMulti" style="font-size:45px; margin:15px 0; font-weight:800; color:var(--neon-pink);">1.00x</div>
            <input type="number" id="dashBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button id="startDashBtn" onclick="window.startDash()" style="padding:10px 24px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; cursor:pointer;">LAUNCH DASH (500)</button>
            <button id="cashoutDashBtn" onclick="window.cashoutDash()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer; display:none;">💰 CASHOUT NOW</button>
        </div>
    `;

    let dashTimer, multi = 1.00, active = false, betAmt = 0;

    window.startDash = function() {
        betAmt = Number(document.getElementById("dashBet").value) || 500;
        if (game.balance < betAmt) return alert("Low Balance!");

        game.balance -= betAmt;
        updateBalance();
        addXP(60);

        active = true; multi = 1.00;
        document.getElementById("startDashBtn").style.display = "none";
        document.getElementById("cashoutDashBtn").style.display = "inline-block";

        const crashAt = (Math.random() * 4 + 1.1).toFixed(2);

        dashTimer = setInterval(() => {
            multi += 0.06;
            document.getElementById("dashMulti").innerText = multi.toFixed(2) + "x";

            if (multi >= crashAt) {
                clearInterval(dashTimer);
                active = false;
                document.getElementById("dashMulti").innerText = "💥 BOOM!";
                playSound('lose');
                document.getElementById("startDashBtn").style.display = "inline-block";
                document.getElementById("cashoutDashBtn").style.display = "none";
            }
        }, 100);
    };

    window.cashoutDash = function() {
        if (!active) return;
        clearInterval(dashTimer);
        active = false;

        const won = Math.floor(betAmt * multi);
        game.balance += won;
        addXP(110);
        updateBalance();
        saveGame();
        playSound('win');
        if (typeof confetti === 'function') confetti();

        alert(`🎉 DASH CASHOUT AT ${multi.toFixed(2)}x! Won ₹${won}`);
        document.getElementById("startDashBtn").style.display = "inline-block";
        document.getElementById("cashoutDashBtn").style.display = "none";
    };
})();
