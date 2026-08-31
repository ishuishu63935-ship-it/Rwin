/* MODULE: LADDER RUSH CLIMB (SUPER VIP LEVEL 80) */
(function initLadder() {
    console.log("🪜 Ladder Rush Loaded!");
    const container = document.getElementById("game-ladder");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">🪜 Cyber Ladder Rush</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 80 Required • Climb 6 rungs or slip down!</p>
            <div id="ladderDisplay" style="font-size:22px; margin:15px 0; font-weight:800; color:var(--neon-pink); background:#0f172a; padding:15px; border-radius:10px;">Ground • 1.0x 🪜</div>
            <input type="number" id="ladderBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.climbRung()" style="padding:10px 20px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">CLIMB RUNG 🧗</button>
            <button id="cashLadderBtn" onclick="window.cashLadder()" style="padding:10px 20px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer; display:none;">💰 CASHOUT</button>
        </div>
    `;

    let rung = 0, betAmt = 0;
    const rungs = [1.0, 1.4, 2.2, 3.8, 7.0, 15.0, 30.0];

    window.climbRung = function() {
        if (rung === 0) {
            betAmt = Number(document.getElementById("ladderBet").value) || 1000;
            if (game.balance < betAmt) return alert("Low Balance!");
            game.balance -= betAmt;
            updateBalance();
        }

        const slip = Math.random() < 0.28;
        if (slip) {
            playSound('lose');
            document.getElementById("ladderDisplay").innerText = "💥 SLIPPED OFF LADDER!";
            alert("💥 SLIPPED! You fell off the ladder.");
            rung = 0;
            document.getElementById("cashLadderBtn").style.display = "none";
        } else {
            rung++;
            const multi = rungs[rung];
            document.getElementById("ladderDisplay").innerText = `Rung ${rung}/6 • Multiplier: ${multi}x 🧗`;
            document.getElementById("cashLadderBtn").style.display = "inline-block";
            document.getElementById("cashLadderBtn").innerText = `💰 CASHOUT (₹${Math.floor(betAmt * multi)})`;
            playSound('win');

            if (rung >= 6) {
                window.cashLadder();
            }
        }
    };

    window.cashLadder = function() {
        if (rung === 0) return;
        const won = Math.floor(betAmt * rungs[rung]);
        game.balance += won;
        addXP(220);
        updateBalance();
        saveGame();
        playSound('win');
        if (typeof confetti === 'function') confetti();
        alert(`🎉 TOP CLIMBER! Cashed out at ${rungs[rung]}x | Won ₹${won}`);
        rung = 0;
        document.getElementById("ladderDisplay").innerText = "Ground • 1.0x 🪜";
        document.getElementById("cashLadderBtn").style.display = "none";
    };
})();
