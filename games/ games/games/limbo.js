/* MODULE: ROCKET LIMBO (SUPER VIP EXCLUSIVE) */
(function initLimbo() {
    console.log("⚡ Limbo Module Loaded!");
    const container = document.getElementById("game-limbo");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">⚡ Rocket Limbo</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Exclusive • Target Target Multiplier Over 1.50X!</p>
            <div id="limboDisplay" style="font-size:45px; margin:15px 0; font-weight:800; color:var(--neon-pink);">1.00x</div>
            <input type="number" id="limboBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playLimbo()" style="padding:10px 24px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; cursor:pointer;">LAUNCH ROCKET (500 Coins)</button>
        </div>
    `;

    window.playLimbo = function() {
        const bet = Number(document.getElementById("limboBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const resultMulti = (Math.random() * 5 + 1.01).toFixed(2);
        document.getElementById("limboDisplay").innerText = `${resultMulti}x`;

        if (resultMulti >= 1.50) {
            const won = Math.floor(bet * resultMulti);
            game.balance += won;
            addXP(90);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 LIMBO SUCCESS! Multiplier hit ${resultMulti}x | Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`💥 BUST! Multiplier crashed at ${resultMulti}x`);
        }
        updateBalance();
        saveGame();
    };
})();
