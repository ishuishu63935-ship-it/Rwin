/* MODULE: GRID MINE 4X4 (SUPER VIP LEVEL 28) */
(function initMines4() {
    console.log("💣 Grid Mine 4x4 Loaded!");
    const container = document.getElementById("game-mines4");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">💣 Grid Mine 4x4 Vault</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 28 Required • 16-Tile Multiplier Grid!</p>
            <div id="m4Display" style="font-size:32px; margin:15px 0;">🎁 🎁 🎁 🎁</div>
            <input type="number" id="m4Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playMines4()" style="padding:10px 24px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; cursor:pointer;">TAP GRID (500)</button>
        </div>
    `;

    window.playMines4 = function() {
        const bet = Number(document.getElementById("m4Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const isMine = Math.random() < 0.25;
        if (!isMine) {
            const multi = (Math.random() * 3 + 1.5).toFixed(1);
            const won = Math.floor(bet * multi);
            game.balance += won; addXP(100); playSound('win');
            document.getElementById("m4Display").innerText = `💎 WIN ${multi}X!`;
            if (multi >= 3 && typeof confetti === 'function') confetti();
            alert(`🎉 SAFE TILE! ${multi}x | Won ₹${won}`);
        } else {
            playSound('lose');
            document.getElementById("m4Display").innerText = `💥 BOMB!`;
            alert("❌ BOMB HIT! Lost bet.");
        }
        updateBalance(); saveGame();
    };
})();
