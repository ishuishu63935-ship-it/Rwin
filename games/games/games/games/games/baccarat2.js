/* MODULE: VIP GOLD BACCARAT (SUPER VIP LEVEL 35) */
(function initBaccarat2() {
    console.log("🃏 Gold Baccarat Loaded!");
    const container = document.getElementById("game-baccarat2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">👑 VIP Gold Baccarat</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 35 Required • High Limit Banker/Player!</p>
            <div id="b2Display" style="font-size:22px; margin:15px 0; font-weight:800; color:var(--neon-gold);">Player: 0 | Banker: 0</div>
            <input type="number" id="b2Bet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playBaccarat2('PLAYER')" style="padding:10px 18px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">PLAYER (2X)</button>
            <button onclick="window.playBaccarat2('BANKER')" style="padding:10px 18px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">BANKER (2X)</button>
        </div>
    `;

    window.playBaccarat2 = function(choice) {
        const bet = Number(document.getElementById("b2Bet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const pPts = Math.floor(Math.random() * 10);
        const bPts = Math.floor(Math.random() * 10);

        document.getElementById("b2Display").innerText = `Player: ${pPts} pts | Banker: ${bPts} pts`;

        let winner = pPts > bPts ? "PLAYER" : (bPts > pPts ? "BANKER" : "TIE");
        if (choice === winner) {
            const won = bet * 2; game.balance += won; addXP(150); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 GOLD BACCARAT WIN! ${winner} Won | Earned ₹${won}`);
        } else if (winner === "TIE") {
            game.balance += bet; alert("👔 TIE GAME! Bet refunded.");
        } else {
            playSound('lose'); alert(`❌ LOST! Winner was ${winner}`);
        }
        updateBalance(); saveGame();
    };
})();
