/* MODULE: CYBER SPEED BACCARAT */
(function initBaccarat() {
    console.log("🃏 Baccarat Module Loaded!");
    const container = document.getElementById("game-baccarat");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🃏 Cyber Speed Baccarat</h2>
            <p style="font-size:11px; color:#94a3b8;">Bet on Player (2X) or Banker (2X) to hit closest to 9 points!</p>
            <div id="baccDisplay" style="font-size:22px; margin:15px 0; font-weight:800; color:var(--neon-gold);">Player: 0 pts | Banker: 0 pts</div>
            <input type="number" id="baccBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playBaccarat('PLAYER')" style="padding:10px 18px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">PLAYER (2X)</button>
            <button onclick="window.playBaccarat('BANKER')" style="padding:10px 18px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">BANKER (2X)</button>
        </div>
    `;

    window.playBaccarat = function(choice) {
        const bet = Number(document.getElementById("baccBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const playerPts = Math.floor(Math.random() * 10);
        const bankerPts = Math.floor(Math.random() * 10);

        document.getElementById("baccDisplay").innerText = `Player: ${playerPts} pts | Banker: ${bankerPts} pts`;

        let winner = "TIE";
        if (playerPts > bankerPts) winner = "PLAYER";
        else if (bankerPts > playerPts) winner = "BANKER";

        if (choice === winner) {
            const won = bet * 2;
            game.balance += won;
            addXP(100);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 BACCARAT WIN! ${winner} Won | Earned ₹${won}`);
        } else if (winner === "TIE") {
            game.balance += bet;
            alert(`👔 TIE GAME! Bets refunded.`);
        } else {
            playSound('lose');
            alert(`❌ LOST! Winner was ${winner}`);
        }
        updateBalance();
        saveGame();
    };
})();
