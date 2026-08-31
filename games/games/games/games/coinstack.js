/* MODULE: COIN STACKER TOWER (SUPER VIP LEVEL 175) */
(function initCoinStack() {
    console.log("🪙 Coin Stack Loaded!");
    const container = document.getElementById("game-coinstack");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🪙 Gold Coin Stacker</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 175 Required • Stack coins high without toppling!</p>
            <div id="stackDisplay" style="font-size:24px; margin:15px 0; font-weight:800; color:var(--neon-gold); background:#0f172a; padding:15px; border-radius:10px;">Height 0 • Multiplier: 1.0x 🪙</div>
            <input type="number" id="stackBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button id="addCoinBtn" onclick="window.stackCoin()" style="padding:10px 20px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">STACK COIN 🪙</button>
            <button id="cashStackBtn" onclick="window.cashStack()" style="padding:10px 20px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer; display:none;">💰 CASHOUT</button>
        </div>
    `;

    let stackHeight = 0, betAmt = 0;
    const multis = [1.0, 1.6, 2.8, 5.0, 10.0, 20.0];

    window.stackCoin = function() {
        if (stackHeight === 0) {
            betAmt = Number(document.getElementById("stackBet").value) || 1000;
            if (game.balance < betAmt) return alert("Low Balance!");
            game.balance -= betAmt;
            updateBalance();
        }

        const isToppled = Math.random() < 0.28;
        if (isToppled) {
            playSound('lose');
            document.getElementById("stackDisplay").innerText = "💥 TOWER TOPPLED!";
            alert("💥 TOPPLED! The stack fell over.");
            stackHeight = 0;
            document.getElementById("cashStackBtn").style.display = "none";
        } else {
            stackHeight++;
            const multi = multis[stackHeight];
            document.getElementById("stackDisplay").innerText = `Height ${stackHeight}/5 • Multiplier: ${multi}x 🪙`;
            document.getElementById("cashStackBtn").style.display = "inline-block";
            document.getElementById("cashStackBtn").innerText = `💰 CASHOUT (₹${Math.floor(betAmt * multi)})`;
            playSound('win');

            if (stackHeight >= 5) {
                window.cashStack();
            }
        }
    };

    window.cashStack = function() {
        if (stackHeight === 0) return;
        const won = Math.floor(betAmt * multis[stackHeight]);
        game.balance += won;
        addXP(250);
        updateBalance();
        saveGame();
        playSound('win');
        if (typeof confetti === 'function') confetti();
        alert(`🎉 STACK CASHOUT! ${multis[stackHeight]}x | Won ₹${won}`);
        stackHeight = 0;
        document.getElementById("stackDisplay").innerText = "Height 0 • Multiplier: 1.0x 🪙";
        document.getElementById("cashStackBtn").style.display = "none";
    };
})();
