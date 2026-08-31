/* MODULE: HIGH ROLLER DICE (SUPER VIP LEVEL 20) */
(function initDice3() {
    console.log("🎲 High Roller Dice Loaded!");
    const container = document.getElementById("game-dice3");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">🎲 High Roller Triple Dice</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 20 Required • Roll 3 Dice for 15+ Total!</p>
            <div id="d3Display" style="font-size:36px; margin:15px 0;">🎲 🎲 🎲</div>
            <input type="number" id="d3Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playDice3()" style="padding:10px 24px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">ROLL TRIPLE DICE (500)</button>
        </div>
    `;

    window.playDice3 = function() {
        const bet = Number(document.getElementById("d3Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const d3 = Math.floor(Math.random() * 6) + 1;
        const total = d1 + d2 + d3;

        document.getElementById("d3Display").innerText = `[${d1}] [${d2}] [${d3}] = ${total}`;

        if (total >= 15) {
            const won = bet * 4; game.balance += won; addXP(160); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 HIGH ROLLER WIN! Total ${total} | Won ₹${won}`);
        } else if (total >= 10) {
            const won = Math.floor(bet * 1.5); game.balance += won; addXP(60); playSound('win');
            alert(`🎉 MEDIUM ROLL! Total ${total} | Won ₹${won}`);
        } else {
            playSound('lose'); alert(`❌ LOW ROLL! Total ${total}`);
        }
        updateBalance(); saveGame();
    };
})();
