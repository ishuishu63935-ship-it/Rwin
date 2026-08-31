/* MODULE: CRYPTO CANDLE UP/DOWN (SUPER VIP LEVEL 65) */
(function initCryptoCandle() {
    console.log("📈 Crypto Candle Module Loaded!");
    const container = document.getElementById("game-cryptocandle");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">📈 BTC Crypto Candle Predictor</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 65 Required • Predict 5s Candle Close (UP/DOWN)!</p>
            <div id="candleDisplay" style="font-size:32px; margin:15px 0; font-weight:800; color:var(--neon-green); background:#050811; padding:20px; border-radius:12px; border:1px solid #334155;">📊 READY FOR TICK</div>
            <input type="number" id="candleBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playCandle('UP')" style="padding:10px 20px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">📈 GREEN (UP 2X)</button>
            <button onclick="window.playCandle('DOWN')" style="padding:10px 20px; background:#ef4444; color:#fff; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">📉 RED (DOWN 2X)</button>
        </div>
    `;

    window.playCandle = function(prediction) {
        const bet = Number(document.getElementById("candleBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const display = document.getElementById("candleDisplay");
        display.innerText = "⏳ TICKING CANDLE...";

        setTimeout(() => {
            const isGreen = Math.random() >= 0.48; // 52/48 odds
            const result = isGreen ? "UP" : "DOWN";
            const price = (65000 + (Math.random() * 500 - 250)).toFixed(2);

            if (isGreen) {
                display.style.color = "var(--neon-green)";
                display.innerText = `📈 GREEN CANDLE ($${price})`;
            } else {
                display.style.color = "#ef4444";
                display.innerText = `📉 RED CANDLE ($${price})`;
            }

            if (prediction === result) {
                const won = bet * 2;
                game.balance += won;
                addXP(150);
                playSound('win');
                if (typeof confetti === 'function') confetti();
                alert(`🎉 TRADE WIN! Candle closed ${result} | Won ₹${won}`);
            } else {
                playSound('lose');
                alert(`❌ TRADE LOST! Candle closed ${result}`);
            }
            updateBalance();
            saveGame();
        }, 1500);
    };
})();
                  
