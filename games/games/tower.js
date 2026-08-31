/* MODULE: CYBER TOWER CLIMB (SUPER VIP LEVEL 1) */
(function initTower() {
    console.log("🗼 Tower Climb Module Loaded!");
    const container = document.getElementById("game-tower");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🗼 Cyber Tower Climb</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 1 Required • Climb 5 Floors for 10X!</p>
            <div id="towerDisplay" style="font-size:24px; margin:15px 0; font-weight:800; color:var(--neon-blue);">Floor 1 | Multiplier: 1.5x</div>
            <input type="number" id="towerBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.climbTower('LEFT')" style="padding:10px 18px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">LEFT TILE</button>
            <button onclick="window.climbTower('RIGHT')" style="padding:10px 18px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">RIGHT TILE</button>
        </div>
    `;

    let currentFloor = 1, towerBetAmt = 0;
    window.climbTower = function(choice) {
        towerBetAmt = Number(document.getElementById("towerBet").value) || 500;
        if (game.balance < towerBetAmt && currentFloor === 1) return alert("Low Balance!");
        if (currentFloor === 1) { game.balance -= towerBetAmt; updateBalance(); }

        const isSafe = Math.random() > 0.3;
        if (isSafe) {
            currentFloor++;
            const multi = (1 + currentFloor * 1.2).toFixed(1);
            document.getElementById("towerDisplay").innerText = `Floor ${currentFloor} | Multiplier: ${multi}x`;
            playSound('win');
            if (currentFloor >= 5) {
                const won = Math.floor(towerBetAmt * multi);
                game.balance += won; addXP(150); updateBalance(); saveGame();
                if (typeof confetti === 'function') confetti();
                alert(`🎉 TOWER CONQUERED! Hit Top Floor! Won ₹${won}`);
                currentFloor = 1;
                document.getElementById("towerDisplay").innerText = `Floor 1 | Multiplier: 1.5x`;
            }
        } else {
            playSound('lose');
            alert(`💥 TRAP HIT at Floor ${currentFloor}! Lost bet.`);
            currentFloor = 1;
            document.getElementById("towerDisplay").innerText = `Floor 1 | Multiplier: 1.5x`;
        }
    };
})();
