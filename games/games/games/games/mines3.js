/* MODULE: CYBER DIAMOND GRID 3X3 (SUPER VIP LEVEL 3) */
(function initMines3() {
    console.log("💎 Diamond Grid Module Loaded!");
    const container = document.getElementById("game-mines3");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">💎 Cyber Diamond Grid (3x3)</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 3 Required • Fast 9-Tile Multipliers!</p>
            <div id="m3Display" style="font-size:32px; margin:15px 0;">💎 💎 💎</div>
            <input type="number" id="m3Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playMines3()" style="padding:10px 24px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">TAP GRID (500)</button>
        </div>
    `;

    window.playMines3 = function() {
        const bet = Number(document.getElementById("m3Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const outcomes = [0, 1.2, 2.0, 3.5, 5.0];
        const res = outcomes[Math.floor(Math.random() * outcomes.length)];
        const won = Math.floor(bet * res);

        document.getElementById("m3Display").innerText = res > 0 ? `💎 ${res}X WIN!` : `💥 BOMB!`;

        if (res > 0) {
            game.balance += won; addXP(75); playSound('win');
            if (res >= 3.5 && typeof confetti === 'function') confetti();
            alert(`🎉 DIAMOND MATCH! ${res}x | Won ₹${won}`);
        } else {
            playSound('lose'); alert("❌ BOMB HIT! Lost bet.");
        }
        updateBalance(); saveGame();
    };
})();
