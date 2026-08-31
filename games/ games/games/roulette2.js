/* MODULE: MINI ROULETTE (SUPER VIP LEVEL 10) */
(function initRoulette2() {
    console.log("🎡 Mini Roulette Loaded!");
    const container = document.getElementById("game-roulette2");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">🎡 Mini European Roulette</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 10 Required • Single Wheel Spin!</p>
            <div id="r2Display" style="font-size:36px; margin:15px 0; font-weight:800; color:var(--neon-green);">🎯 READY</div>
            <input type="number" id="r2Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playRoulette2('EVEN')" style="padding:10px 18px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">EVEN (2X)</button>
            <button onclick="window.playRoulette2('ODD')" style="padding:10px 18px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">ODD (2X)</button>
        </div>
    `;

    window.playRoulette2 = function(choice) {
        const bet = Number(document.getElementById("r2Bet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const num = Math.floor(Math.random() * 36) + 1;
        const isEven = num % 2 === 0;
        const resultType = isEven ? "EVEN" : "ODD";

        document.getElementById("r2Display").innerText = `[ ${num} ] - ${resultType}`;

        if (choice === resultType) {
            const won = bet * 2; game.balance += won; addXP(100); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 ROULETTE WIN! Landed on ${num} (${resultType}) | Won ₹${won}`);
        } else {
            playSound('lose'); alert(`❌ LOST! Landed on ${num} (${resultType})`);
        }
        updateBalance(); saveGame();
    };
})();
