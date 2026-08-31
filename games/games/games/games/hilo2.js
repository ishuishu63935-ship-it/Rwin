/* MODULE: RED / BLACK CARD STREAK */
(function initHilo2() {
    console.log("♥️ Red Black Module Loaded!");
    const container = document.getElementById("game-hilo2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">♥️ Cyber Red/Black Card</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Exclusive • Predict Red or Black Card Suit!</p>
            <div id="hilo2Display" style="font-size:55px; margin:15px 0;">🎴</div>
            <input type="number" id="hilo2Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playHilo2('RED')" style="padding:10px 18px; background:#ef4444; color:#fff; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">RED (2X)</button>
            <button onclick="window.playHilo2('BLACK')" style="padding:10px 18px; background:#1e293b; color:#fff; border:1px solid #334155; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">BLACK (2X)</button>
        </div>
    `;

    window.playHilo2 = function(choice) {
        const bet = Number(document.getElementById("hilo2Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const suits = [
            { icon: "♥️", color: "RED" },
            { icon: "♦️", color: "RED" },
            { icon: "♠️", color: "BLACK" },
            { icon: "♣️", color: "BLACK" }
        ];
        const card = suits[Math.floor(Math.random() * suits.length)];
        document.getElementById("hilo2Display").innerText = card.icon;

        if (choice === card.color) {
            const won = bet * 2;
            game.balance += won;
            addXP(65);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 CARD WIN! ${card.icon} (${card.color}) | Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ LOST! Card was ${card.icon} (${card.color})`);
        }
        updateBalance();
        saveGame();
    };
})();
