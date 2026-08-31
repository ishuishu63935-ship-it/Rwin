/* MODULE: HYPER LIMBO (SUPER VIP LEVEL 45) */
(function initLimbo2() {
    console.log("⚡ Hyper Limbo Loaded!");
    const container = document.getElementById("game-limbo2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">⚡ Hyper Limbo 100X</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 45 Required • Insane Multiplier Rush!</p>
            <div id="l2Display" style="font-size:45px; margin:15px 0; font-weight:800; color:var(--neon-pink);">1.00x</div>
            <input type="number" id="l2Bet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playLimbo2()" style="padding:10px 24px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; cursor:pointer;">LAUNCH HYPER (1000)</button>
        </div>
    `;

    window.playLimbo2 = function() {
        const bet = Number(document.getElementById("l2Bet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const multi = (Math.random() * 15 + 1.05).toFixed(2);
        document.getElementById("l2Display").innerText = `${multi}x`;

        if (multi >= 2.00) {
            const won = Math.floor(bet * multi);
            game.balance += won; addXP(180); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 HYPER LIMBO HIT! ${multi}x | Won ₹${won}`);
        } else {
            playSound('lose'); alert(`💥 BUSTED at ${multi}x`);
        }
        updateBalance(); saveGame();
    };
})();
