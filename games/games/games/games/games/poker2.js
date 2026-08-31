/* MODULE: TEXAS SPEED POKER (SUPER VIP LEVEL 55) */
(function initPoker2() {
    console.log("♠️ Texas Poker Loaded!");
    const container = document.getElementById("game-poker2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">♠️ Texas Speed Hold'em</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 55 Required • Fast High Stakes Hand!</p>
            <div id="p2HandDisplay" style="font-size:32px; margin:15px 0; font-weight:800; color:var(--neon-green);">[ 🎴 🎴 ] vs [ 🎴 🎴 ]</div>
            <input type="number" id="p2HandBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playPoker2()" style="padding:10px 24px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">DEAL HAND (1000)</button>
        </div>
    `;

    window.playPoker2 = function() {
        const bet = Number(document.getElementById("p2HandBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const pVal = Math.floor(Math.random() * 10) + 10;
        const dVal = Math.floor(Math.random() * 10) + 10;

        document.getElementById("p2HandDisplay").innerText = `Player: ${pVal} pts | Dealer: ${dVal} pts`;

        if (pVal > dVal) {
            const won = bet * 2.5; game.balance += won; addXP(200); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 POKER HAND WIN! Won ₹${won}`);
        } else if (pVal === dVal) {
            game.balance += bet; alert("👔 PUSH! Bet refunded.");
        } else {
            playSound('lose'); alert("❌ DEALER HIGHER HAND!");
        }
        updateBalance(); saveGame();
    };
})();
