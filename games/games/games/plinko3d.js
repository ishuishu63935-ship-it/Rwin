/* MODULE: 3D NEON GRAVITY DROP (SUPER VIP LEVEL 145) */
(function initPlinko3D() {
    console.log("🟢 3D Gravity Drop Loaded!");
    const container = document.getElementById("game-plinko3d");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">🟢 3D Neon Gravity Drop</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 145 Required • Gravity physics drop with dynamic pegs!</p>
            <div id="p3dDisplay" style="font-size:32px; margin:15px 0; font-weight:800; color:var(--neon-green); background:#050811; padding:15px; border-radius:10px;">🟢 READY TO DROP</div>
            <input type="number" id="p3dBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.dropGravityBall()" style="padding:10px 24px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">DROP BALL 🟢 (1000)</button>
        </div>
    `;

    window.dropGravityBall = function() {
        const bet = Number(document.getElementById("p3dBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const slots = [0.2, 0.8, 1.5, 3.0, 6.0, 15.0, 40.0];
        const res = slots[Math.floor(Math.random() * slots.length)];
        const won = Math.floor(bet * res);

        document.getElementById("p3dDisplay").innerText = `🎯 POCKET: ${res}X!`;

        if (res >= 1) {
            game.balance += won;
            addXP(200);
            playSound('win');
            if (res >= 15 && typeof confetti === 'function') confetti();
            alert(`🎉 GRAVITY DROP WIN! ${res}x | Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ LOW MULTIPLIER POCKET! ${res}x | Won ₹${won}`);
        }
        updateBalance();
        saveGame();
    };
})();
