/* MODULE: CYBER NEON DICE 2.0 */
(function initDice2() {
    console.log("🎲 Dice 2.0 Module Loaded!");
    const container = document.getElementById("game-dice2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🎲 Cyber Neon Dice 2.0</h2>
            <p style="font-size:11px; color:#94a3b8;">Roll 1-6 • Predict Under 4 or Over 3 for 2X Coins!</p>
            <div id="dice2Display" style="font-size:60px; margin:15px 0;">🎲</div>
            <input type="number" id="dice2Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playDice2('UNDER')" style="padding:10px 18px; background:#ef4444; color:#fff; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">UNDER 4 (2X)</button>
            <button onclick="window.playDice2('OVER')" style="padding:10px 18px; background:var(--neon-green); color:#fff; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">OVER 3 (2X)</button>
        </div>
    `;

    window.playDice2 = function(choice) {
        const bet = Number(document.getElementById("dice2Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const roll = Math.floor(Math.random() * 6) + 1;
        const diceIcons = ["🎲", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
        document.getElementById("dice2Display").innerText = diceIcons[roll];

        const win = (choice === 'UNDER' && roll <= 3) || (choice === 'OVER' && roll >= 4);

        if (win) {
            const won = bet * 2;
            game.balance += won;
            addXP(70);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 DICE WIN! Rolled ${roll} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ LOST! Rolled ${roll}`);
        }
        updateBalance();
        saveGame();
    };
})();
          
