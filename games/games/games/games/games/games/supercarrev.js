/* MODULE: SUPERCAR ENGINE REV (SUPER VIP LEVEL 210) */
(function initSupercarRev() {
    console.log("🏎️ Supercar Rev Loaded!");
    const container = document.getElementById("game-supercarrev");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🏎️ Supercar Engine Rev</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 210 Required • Rev RPM to max before engine blows!</p>
            <div id="rpmDisplay" style="font-size:26px; margin:15px 0; font-weight:800; color:var(--neon-gold); background:#0f172a; padding:15px; border-radius:10px;">RPM: 1,000 • 1.0x 🏎️</div>
            <input type="number" id="rpmBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button id="revBtn" onclick="window.revEngine()" style="padding:10px 20px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">REV ENGINE 🏎️</button>
            <button id="cashRpmBtn" onclick="window.cashRev()" style="padding:10px 20px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer; display:none;">💰 CASHOUT</button>
        </div>
    `;

    let rpm = 1000, betAmt = 0;
    const multis = [1.0, 1.5, 2.5, 4.5, 8.0, 18.0];

    window.revEngine = function() {
        if (rpm === 1000) {
            betAmt = Number(document.getElementById("rpmBet").value) || 1000;
            if (game.balance < betAmt) return alert("Low Balance!");
            game.balance -= betAmt;
            updateBalance();
        }

        const blown = Math.random() < 0.28;
        if (blown) {
            playSound('lose');
            document.getElementById("rpmDisplay").innerText = "💥 ENGINE BLOWN! 💨";
            alert("💥 ENGINE BLOWN! Piston melted from over-revving.");
            rpm = 1000;
            document.getElementById("cashRpmBtn").style.display = "none";
        } else {
            rpm += 2000;
            const step = Math.min(Math.floor(rpm / 2000), 5);
            const multi = multis[step];
            document.getElementById("rpmDisplay").innerText = `RPM: ${rpm.toLocaleString()} • Multiplier: ${multi}x 🏎️`;
            document.getElementById("cashRpmBtn").style.display = "inline-block";
            document.getElementById("cashRpmBtn").innerText = `💰 CASHOUT (₹${Math.floor(betAmt * multi)})`;
            playSound('win');

            if (step >= 5) {
                window.cashRev();
            }
        }
    };

    window.cashRev = function() {
        if (rpm === 1000) return;
        const step = Math.min(Math.floor(rpm / 2000), 5);
        const won = Math.floor(betAmt * multis[step]);
        game.balance += won;
        addXP(270);
        updateBalance();
        saveGame();
        playSound('win');
        if (typeof confetti === 'function') confetti();
        alert(`🎉 ENGINE CASHOUT! ${multis[step]}x | Won ₹${won}`);
        rpm = 1000;
        document.getElementById("rpmDisplay").innerText = "RPM: 1,000 • 1.0x 🏎️";
        document.getElementById("cashRpmBtn").style.display = "none";
    };
})();
