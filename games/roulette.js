/* MODULE: CYBER ROULETTE (SUPER VIP EXCLUSIVE) */
(function initRoulette() {
    console.log("🎡 Roulette Module Loaded!");
    const container = document.getElementById("game-roulette");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🎡 Cyber Roulette</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Exclusive • Pick Red/Black or Direct Number for 36X!</p>
            <div id="rouletteDisplay" style="font-size:45px; margin:15px 0;">🎯</div>
            <input type="number" id="rouletteBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playRoulette('RED')" style="padding:10px 18px; background:#ef4444; color:#fff; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">RED (2X)</button>
            <button onclick="window.playRoulette('BLACK')" style="padding:10px 18px; background:#1e293b; color:#fff; border:1px solid #334155; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">BLACK (2X)</button>
        </div>
    `;

    window.playRoulette = function(choice) {
        const bet = Number(document.getElementById("rouletteBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        
        game.balance -= bet;
        updateBalance();

        const num = Math.floor(Math.random() * 37);
        const winColor = num === 0 ? "GREEN" : (num % 2 === 0 ? "BLACK" : "RED");
        document.getElementById("rouletteDisplay").innerText = `${num} (${winColor})`;

        if (choice === winColor) {
            const won = bet * 2;
            game.balance += won;
            addXP(80);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 ROULETTE WIN! Landed on ${num} ${winColor} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ LOST! Landed on ${num} ${winColor}`);
        }
        updateBalance();
        saveGame();
    };
})();
