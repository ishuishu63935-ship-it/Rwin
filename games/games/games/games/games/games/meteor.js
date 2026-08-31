/* MODULE: METEOR DODGE RUSH (SUPER VIP LEVEL 185) */
(function initMeteor() {
    console.log("☄️ Meteor Dodge Loaded!");
    const container = document.getElementById("game-meteor");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">☄️ Space Meteor Dodge Rush</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 185 Required • Steer spaceship clear of space debris!</p>
            <div id="meteorDisplay" style="font-size:36px; margin:15px 0; background:#000; padding:15px; border-radius:10px;">🚀 READY FOR FLYBY</div>
            <input type="number" id="meteorBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.flyMeteor('LEFT')" style="padding:10px 18px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">⬅️ DODGE LEFT</button>
            <button onclick="window.flyMeteor('RIGHT')" style="padding:10px 18px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">DODGE RIGHT ➡️</button>
        </div>
    `;

    window.flyMeteor = function(dir) {
        const bet = Number(document.getElementById("meteorBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const crashDir = Math.random() < 0.5 ? "LEFT" : "RIGHT";
        if (dir !== crashDir) {
            const won = Math.floor(bet * 2.2);
            game.balance += won;
            addXP(210);
            playSound('win');
            document.getElementById("meteorDisplay").innerText = "✨ METEOR DODGED!";
            if (typeof confetti === 'function') confetti();
            alert(`🎉 FLYBY SUCCESS! Won ₹${won}`);
        } else {
            playSound('lose');
            document.getElementById("meteorDisplay").innerText = "💥 CRASHED INTO METEOR!";
            alert("❌ SHIP DESTROYED!");
        }
        updateBalance();
        saveGame();
    };
})();
