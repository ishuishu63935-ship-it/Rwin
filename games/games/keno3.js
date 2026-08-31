/* MODULE: VIP KENO 80 (SUPER VIP LEVEL 25) */
(function initKeno3() {
    console.log("🔢 Keno 80 Loaded!");
    const container = document.getElementById("game-keno3");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🔢 VIP Keno 80 Lottery</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 25 Required • Pick High Numbers!</p>
            <div id="k3Display" style="font-size:36px; margin:15px 0; font-weight:800; color:var(--neon-blue);">[ 0 ] [ 0 ]</div>
            <input type="number" id="k3Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playKeno3()" style="padding:10px 24px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">DRAW NUMBERS (500)</button>
        </div>
    `;

    window.playKeno3 = function() {
        const bet = Number(document.getElementById("k3Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const n1 = Math.floor(Math.random() * 80) + 1;
        const n2 = Math.floor(Math.random() * 80) + 1;

        document.getElementById("k3Display").innerText = `[ ${n1} ] [ ${n2} ]`;

        if (n1 === n2) {
            const won = bet * 15; game.balance += won; addXP(220); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 PERFECT MATCH! Numbers ${n1} & ${n2} | Won ₹${won}`);
        } else if (Math.abs(n1 - n2) <= 5) {
            const won = bet * 2; game.balance += won; addXP(80); playSound('win');
            alert(`🎉 CLOSE MATCH! Won ₹${won}`);
        } else {
            playSound('lose');
        }
        updateBalance(); saveGame();
    };
})();
