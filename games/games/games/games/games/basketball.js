/* MODULE: CYBER BASKETBALL DUNK (SUPER VIP LEVEL 180) */
(function initBasketball() {
    console.log("🏀 Basketball Loaded!");
    const container = document.getElementById("game-basketball");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">🏀 Cyber Basketball Dunk</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 180 Required • Sink 3-Pointers or Cyber Slam Dunk!</p>
            <div id="hoopDisplay" style="font-size:36px; margin:15px 0;">🏀 🗑️</div>
            <input type="number" id="ballBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.shootHoop('THREE')" style="padding:10px 18px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">🎯 3-POINTER (2.5X)</button>
            <button onclick="window.shootHoop('DUNK')" style="padding:10px 18px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">🔥 SLAM DUNK (4X)</button>
        </div>
    `;

    window.shootHoop = function(style) {
        const bet = Number(document.getElementById("ballBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const successChance = style === 'THREE' ? 0.45 : 0.28;
        const multi = style === 'THREE' ? 2.5 : 4.0;
        const isSwish = Math.random() < successChance;

        if (isSwish) {
            const won = Math.floor(bet * multi);
            game.balance += won;
            addXP(220);
            playSound('win');
            document.getElementById("hoopDisplay").innerText = "🔥 SWISH! GOAL! 🗑️";
            if (typeof confetti === 'function') confetti();
            alert(`🎉 BASKETBALL SHOT HIT! Won ₹${won}`);
        } else {
            playSound('lose');
            document.getElementById("hoopDisplay").innerText = "💥 MISSED HOOP!";
            alert("❌ SHOT MISSED!");
        }
        updateBalance();
        saveGame();
    };
})();
