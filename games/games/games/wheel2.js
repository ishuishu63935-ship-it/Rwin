/* MODULE: VIP MEGA WHEEL */
(function initMegaWheel() {
    console.log("🎡 Mega Wheel Module Loaded!");
    const container = document.getElementById("game-wheel2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">🎡 VIP Mega Multiplier Wheel</h2>
            <p style="font-size:11px; color:#94a3b8;">Spin for Multipliers up to 50X!</p>
            <div id="megaWheelDisplay" style="font-size:45px; margin:15px 0; font-weight:800; color:var(--neon-pink);">1.0x</div>
            <input type="number" id="wheel2Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playMegaWheel()" style="padding:10px 24px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; cursor:pointer;">SPIN MEGA WHEEL</button>
        </div>
    `;

    window.playMegaWheel = function() {
        const bet = Number(document.getElementById("wheel2Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const slots = [0, 0.5, 1.2, 2.0, 3.0, 5.0, 10.0, 50.0];
        const multi = slots[Math.floor(Math.random() * slots.length)];
        const won = Math.floor(bet * multi);

        document.getElementById("megaWheelDisplay").innerText = `${multi}x`;

        if (multi >= 1) {
            game.balance += won;
            addXP(100);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 MEGA SPIN WIN! Multiplier ${multi}x | Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ Multiplier ${multi}x | Won ₹${won}`);
        }
        updateBalance();
        saveGame();
    };
})();
