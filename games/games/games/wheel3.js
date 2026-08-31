/* MODULE: CYBER COLOR WHEEL */
(function initWheel3() {
    console.log("🎡 Color Wheel Module Loaded!");
    const container = document.getElementById("game-wheel3");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🎡 Cyber Color Wheel</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Exclusive • Multiplier color wheel!</p>
            <div id="wheel3Display" style="font-size:45px; margin:15px 0; font-weight:800; color:var(--neon-gold);">🟡 2X</div>
            <input type="number" id="wheel3Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playWheel3()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">SPIN WHEEL (500 Coins)</button>
        </div>
    `;

    window.playWheel3 = function() {
        const bet = Number(document.getElementById("wheel3Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const options = [
            { icon: "🔴 0X", multi: 0 },
            { icon: "🟢 1.5X", multi: 1.5 },
            { icon: "🟡 3X", multi: 3 },
            { icon: "🟣 5X", multi: 5 },
            { icon: "💎 20X", multi: 20 }
        ];
        const res = options[Math.floor(Math.random() * options.length)];
        const won = Math.floor(bet * res.multi);

        document.getElementById("wheel3Display").innerText = res.icon;

        if (res.multi >= 1) {
            game.balance += won;
            addXP(80);
            playSound('win');
            if (res.multi >= 5 && typeof confetti === 'function') confetti();
            alert(`🎉 WHEEL WIN! ${res.icon} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ LOST! ${res.icon}`);
        }
        updateBalance();
        saveGame();
    };
})();
