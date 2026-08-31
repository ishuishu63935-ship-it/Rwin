/* MODULE: CYBER LASER DODGE (SUPER VIP LEVEL 165) */
(function initLaserGrid() {
    console.log("⚡ Laser Grid Loaded!");
    const container = document.getElementById("game-lasergrid");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">⚡ Cyber Laser Grid Dodge</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 165 Required • Pick Blue, Green, or Red Safe Beam!</p>
            <div id="laserDisplay" style="font-size:36px; margin:15px 0; background:#050811; padding:15px; border-radius:10px; border:1px solid var(--neon-blue);">⚡ READY TO DODGE</div>
            <input type="number" id="laserBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.dodgeLaser('BLUE')" style="padding:10px 14px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">🔵 BLUE BEAM (2.5X)</button>
            <button onclick="window.dodgeLaser('GREEN')" style="padding:10px 14px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">🟢 GREEN BEAM (2.5X)</button>
            <button onclick="window.dodgeLaser('RED')" style="padding:10px 14px; background:#ef4444; color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">🔴 RED BEAM (2.5X)</button>
        </div>
    `;

    window.dodgeLaser = function(pick) {
        const bet = Number(document.getElementById("laserBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const safeBeam = ["BLUE", "GREEN", "RED"][Math.floor(Math.random() * 3)];
        document.getElementById("laserDisplay").innerText = `⚡ SAFE BEAM: ${safeBeam}`;

        if (pick === safeBeam) {
            const won = Math.floor(bet * 2.5);
            game.balance += won;
            addXP(220);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 LASER DODGED! Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ ZAPPED BY LASER! Safe beam was ${safeBeam}`);
        }
        updateBalance();
        saveGame();
    };
})();
