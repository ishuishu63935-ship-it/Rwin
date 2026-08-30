/* MODULE: CYBER KENO (SUPER VIP EXCLUSIVE) */
(function initKeno() {
    console.log("🔢 Keno Module Loaded!");
    const container = document.getElementById("game-keno");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🔢 Cyber Keno Lottery</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Exclusive • Match Lucky Numbers for Multipliers!</p>
            <div id="kenoDisplay" style="font-size:36px; margin:15px 0; font-weight:800; color:var(--neon-blue);">[ 0 ] [ 0 ] [ 0 ]</div>
            <input type="number" id="kenoBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playKeno()" style="padding:10px 24px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">DRAW NUMBERS (500 Coins)</button>
        </div>
    `;

    window.playKeno = function() {
        const bet = Number(document.getElementById("kenoBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        const n3 = Math.floor(Math.random() * 10) + 1;

        document.getElementById("kenoDisplay").innerText = `[ ${n1} ] [ ${n2} ] [ ${n3} ]`;

        if (n1 === n2 && n2 === n3) {
            const won = bet * 10;
            game.balance += won;
            addXP(150);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 TRIPLE KENO MATCH! Won ₹${won}`);
        } else if (n1 === n2 || n2 === n3 || n1 === n3) {
            const won = bet * 2;
            game.balance += won;
            addXP(60);
            playSound('win');
            alert(`🎉 DOUBLE MATCH! Won ₹${won}`);
        } else {
            playSound('lose');
        }
        updateBalance();
        saveGame();
    };
})();
