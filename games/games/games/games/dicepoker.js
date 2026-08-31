/* MODULE: CYBER DICE POKER (SUPER VIP LEVEL 150) */
(function initDicePoker() {
    console.log("🎲 Dice Poker Loaded!");
    const container = document.getElementById("game-dicepoker");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🎲 Cyber Dice Poker Combo</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 150 Required • Roll 5 Dice for Pairs, Triples or Full House!</p>
            <div id="dpDisplay" style="font-size:28px; margin:15px 0; font-weight:800; color:var(--neon-blue); background:#0f172a; padding:15px; border-radius:10px;">🎲 🎲 🎲 🎲 🎲</div>
            <input type="number" id="dpBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.rollDicePoker()" style="padding:10px 24px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">ROLL 5 DICE 🎲 (1000)</button>
        </div>
    `;

    window.rollDicePoker = function() {
        const bet = Number(document.getElementById("dpBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const dice = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ];

        document.getElementById("dpDisplay").innerText = dice.map(d => `[${d}]`).join(" ");

        const counts = {};
        dice.forEach(x => { counts[x] = (counts[x] || 0) + 1; });
        const maxFreq = Math.max(...Object.values(counts));

        if (maxFreq >= 4) {
            const won = bet * 10;
            game.balance += won;
            addXP(280);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 4-OF-A-KIND POKER ROLL! 10X | Won ₹${won}`);
        } else if (maxFreq === 3) {
            const won = bet * 3;
            game.balance += won;
            addXP(150);
            playSound('win');
            alert(`🎉 TRIPLE MATCH! 3X | Won ₹${won}`);
        } else if (maxFreq === 2) {
            const won = Math.floor(bet * 1.5);
            game.balance += won;
            addXP(80);
            playSound('win');
            alert(`🎉 PAIR MATCH! 1.5X | Won ₹${won}`);
        } else {
            playSound('lose');
            alert("❌ NO MATCHING PAIRS!");
        }
        updateBalance();
        saveGame();
    };
})();
