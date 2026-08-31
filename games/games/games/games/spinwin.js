/* MODULE: LUCKY SPIN 50X (SUPER VIP LEVEL 30) */
(function initSpinWin() {
    console.log("🌀 Spin Win Loaded!");
    const container = document.getElementById("game-spinwin");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🌀 Lucky Spin 50X Wheel</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 30 Required • Rapid Spin Multipliers!</p>
            <div id="swDisplay" style="font-size:45px; margin:15px 0; font-weight:800; color:var(--neon-gold);">1.0x</div>
            <input type="number" id="swBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playSpinWin()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">SPIN WHEEL (500)</button>
        </div>
    `;

    window.playSpinWin = function() {
        const bet = Number(document.getElementById("swBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const multis = [0, 0.8, 1.5, 3.0, 8.0, 50.0];
        const res = multis[Math.floor(Math.random() * multis.length)];
        const won = Math.floor(bet * res);

        document.getElementById("swDisplay").innerText = `${res}x`;

        if (res >= 1) {
            game.balance += won; addXP(140); playSound('win');
            if (res >= 8 && typeof confetti === 'function') confetti();
            alert(`🎉 LUCKY SPIN WIN! ${res}x | Won ₹${won}`);
        } else {
            playSound('lose'); alert(`❌ SKIPPED! ${res}x`);
        }
        updateBalance(); saveGame();
    };
})();
