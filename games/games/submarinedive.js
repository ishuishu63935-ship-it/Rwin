/* MODULE: CYBER SUBMARINE DIVE (SUPER VIP LEVEL 190) */
(function initSubmarine() {
    console.log("🌊 Submarine Dive Loaded!");
    const container = document.getElementById("game-submarinedive");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🌊 Cyber Submarine Deep Dive</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 190 Required • Dive deeper for huge multipliers before pressure crushes hull!</p>
            <div id="subDisplay" style="font-size:24px; margin:15px 0; font-weight:800; color:var(--neon-blue); background:#0f172a; padding:15px; border-radius:10px;">Depth 0m • 1.0x ⚓</div>
            <input type="number" id="subBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button id="diveBtn" onclick="window.diveSubmarine()" style="padding:10px 20px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">DIVE DEEPER ⚓</button>
            <button id="cashSubBtn" onclick="window.cashSubmarine()" style="padding:10px 20px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer; display:none;">💰 SURFACE & CASHOUT</button>
        </div>
    `;

    let depth = 0, betAmt = 0;
    const multis = [1.0, 1.5, 2.6, 4.8, 9.5, 22.0];

    window.diveSubmarine = function() {
        if (depth === 0) {
            betAmt = Number(document.getElementById("subBet").value) || 1000;
            if (game.balance < betAmt) return alert("Low Balance!");
            game.balance -= betAmt;
            updateBalance();
        }

        const imploded = Math.random() < 0.26;
        if (imploded) {
            playSound('lose');
            document.getElementById("subDisplay").innerText = "💥 HULL IMPLODED!";
            alert("💥 IMPLODED! Water pressure crushed the submarine.");
            depth = 0;
            document.getElementById("cashSubBtn").style.display = "none";
        } else {
            depth++;
            const multi = multis[depth];
            document.getElementById("subDisplay").innerText = `Depth ${depth * 200}m • Multiplier: ${multi}x ⚓`;
            document.getElementById("cashSubBtn").style.display = "inline-block";
            document.getElementById("cashSubBtn").innerText = `💰 CASHOUT (₹${Math.floor(betAmt * multi)})`;
            playSound('win');

            if (depth >= 5) {
                window.cashSubmarine();
            }
        }
    };

    window.cashSubmarine = function() {
        if (depth === 0) return;
        const won = Math.floor(betAmt * multis[depth]);
        game.balance += won;
        addXP(260);
        updateBalance();
        saveGame();
        playSound('win');
        if (typeof confetti === 'function') confetti();
        alert(`🎉 SURFACE CASHOUT! ${multis[depth]}x | Won ₹${won}`);
        depth = 0;
        document.getElementById("subDisplay").innerText = "Depth 0m • 1.0x ⚓";
        document.getElementById("cashSubBtn").style.display = "none";
    };
})();
