/* MODULE: CYBER VIDEO POKER */
(function initPoker() {
    console.log("♠️ Poker Module Loaded!");
    const container = document.getElementById("game-poker");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">♠️ Cyber Video Poker</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Exclusive • Draw 3 Cards to Hit Pairs or Triples!</p>
            <div id="pokerDisplay" style="font-size:32px; margin:15px 0; font-weight:800; color:var(--neon-blue);">[ 🎴 ] [ 🎴 ] [ 🎴 ]</div>
            <input type="number" id="pokerBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playPoker()" style="padding:10px 24px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">DEAL HAND (500 Coins)</button>
        </div>
    `;

    window.playPoker = function() {
        const bet = Number(document.getElementById("pokerBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const ranks = ["A", "K", "Q", "J", "10", "9"];
        const c1 = ranks[Math.floor(Math.random() * ranks.length)];
        const c2 = ranks[Math.floor(Math.random() * ranks.length)];
        const c3 = ranks[Math.floor(Math.random() * ranks.length)];

        document.getElementById("pokerDisplay").innerText = `[ ${c1} ] [ ${c2} ] [ ${c3} ]`;

        if (c1 === c2 && c2 === c3) {
            const won = bet * 8;
            game.balance += won;
            addXP(140);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 THREE OF A KIND! Won ₹${won}`);
        } else if (c1 === c2 || c2 === c3 || c1 === c3) {
            const won = bet * 2;
            game.balance += won;
            addXP(60);
            playSound('win');
            alert(`🎉 PAIR HIT! Won ₹${won}`);
        } else {
            playSound('lose');
        }
        updateBalance();
        saveGame();
    };
})();
