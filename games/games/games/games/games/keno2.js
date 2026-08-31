/* MODULE: SPEED KENO 2.0 */
(function initKeno2() {
    console.log("⚡ Keno 2.0 Module Loaded!");
    const container = document.getElementById("game-keno2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">⚡ Speed Keno Express</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Exclusive • Rapid-fire lucky draw!</p>
            <div id="keno2Display" style="font-size:36px; margin:15px 0; font-weight:800; color:var(--neon-green);">⚡ 0 ⚡</div>
            <input type="number" id="keno2Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playKeno2()" style="padding:10px 24px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">EXPRESS DRAW (500)</button>
        </div>
    `;

    window.playKeno2 = function() {
        const bet = Number(document.getElementById("keno2Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const num = Math.floor(Math.random() * 50) + 1;
        document.getElementById("keno2Display").innerText = `⚡ ${num} ⚡`;

        if (num % 7 === 0 || num === 7 || num === 21 || num === 49) {
            const won = bet * 5;
            game.balance += won;
            addXP(120);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 LUCKY MULTIPLIER HIT! Number ${num} | Won ₹${won}`);
        } else if (num % 2 === 0) {
            const won = Math.floor(bet * 1.5);
            game.balance += won;
            addXP(50);
            playSound('win');
            alert(`🎉 EVEN MATCH! Number ${num} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ NO HIT! Number ${num}`);
        }
        updateBalance();
        saveGame();
    };
})();
