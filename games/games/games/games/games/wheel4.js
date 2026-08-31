/* MODULE: FORTUNE WHEEL 100X (SUPER VIP LEVEL 5) */
(function initWheel4() {
    console.log("🌟 Fortune Wheel 100X Loaded!");
    const container = document.getElementById("game-wheel4");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">🌟 Fortune Wheel 100X</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 5 Required • Mega High-Risk Jackpot Wheel!</p>
            <div id="w4Display" style="font-size:45px; margin:15px 0; font-weight:800; color:var(--neon-pink);">1.0x</div>
            <input type="number" id="w4Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playWheel4()" style="padding:10px 24px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; cursor:pointer;">SPIN 100X WHEEL</button>
        </div>
    `;

    window.playWheel4 = function() {
        const bet = Number(document.getElementById("w4Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const multis = [0, 0, 0.5, 1.5, 2.0, 5.0, 10.0, 100.0];
        const res = multis[Math.floor(Math.random() * multis.length)];
        const won = Math.floor(bet * res);

        document.getElementById("w4Display").innerText = `${res}x`;

        if (res >= 1) {
            game.balance += won; addXP(110); playSound('win');
            if (res >= 10 && typeof confetti === 'function') confetti();
            alert(`🎉 WHEEL WIN! ${res}x | Won ₹${won}`);
        } else {
            playSound('lose'); alert(`❌ SKIPPED! ${res}x`);
        }
        updateBalance(); saveGame();
    };
})();
