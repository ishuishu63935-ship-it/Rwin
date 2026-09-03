/* MODULE: FORTUNE WHEEL 100X 3.0 (ROTATING WHEEL & AUDIO ENGINE) */
(function initWheelModule() {
    console.log("🌟 Fortune Wheel 100X 3.0 Engine Loaded!");
    const container = document.getElementById("game-wheel");
    if (!container) return;

    let currentRotation = 0;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <!-- Header Bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:#050811; padding:10px 14px; border-radius:12px; border:1px solid #1e293b;">
                <span style="font-size:14px; color:var(--neon-gold); font-weight:800;">🌟 Fortune Wheel 100X</span>
                <span style="font-size:11px; color:var(--neon-gold); font-weight:600;">🔒 Super VIP Exclusive</span>
            </div>

            <!-- Rotating Wheel Visual -->
            <div style="position:relative; width:190px; height:190px; margin:15px auto;">
                <div style="position:absolute; top:-12px; left:50%; transform:translateX(-50%); z-index:10; font-size:24px;">🔻</div>
                <div id="wheelGraphic" style="width:100%; height:100%; border-radius:50%; border:4px solid var(--neon-gold); background:conic-gradient(#ef4444 0deg 60deg, #10b981 60deg 120deg, #3b82f6 120deg 180deg, #f59e0b 180deg 240deg, #8b5cf6 240deg 300deg, #ec4899 300deg 360deg); transition:transform 3.2s cubic-bezier(0.15, 0.9, 0.15, 1); display:flex; align-items:center; justify-content:center; box-shadow:0 0 25px rgba(245,158,11,0.3);">
                    <div style="width:44px; height:44px; background:#0f172a; border-radius:50%; border:2px solid #fff; display:flex; align-items:center; justify-content:center; font-weight:800; color:#fff; font-size:12px;">100X</div>
                </div>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:14px;">
                <input type="number" id="wheelBetInput" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('wheelBetInput').value = Math.floor(Number(document.getElementById('wheelBetInput').value)*2); if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                <button onclick="document.getElementById('wheelBetInput').value = window.game.balance; if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
            </div>

            <button id="spinWheelBtn" onclick="window.spinFortuneWheel()" style="width:100%; padding:14px; background:linear-gradient(135deg, var(--neon-gold), #d97706); color:#000; font-weight:800; border-radius:12px; font-size:16px; border:none; cursor:pointer; box-shadow:0 0 15px rgba(245,158,11,0.3);">🌟 SPIN FORTUNE WHEEL</button>
        </div>
    `;

    window.spinFortuneWheel = function() {
        const bet = Number(document.getElementById("wheelBetInput").value) || 500;
        if (window.game.balance < bet) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        if (window.CasinoAudio) window.CasinoAudio.playChip();

        window.game.balance -= bet;
        window.updateBalance();
        window.addXP(90);

        const btn = document.getElementById("spinWheelBtn");
        btn.disabled = true;

        const multipliers = [
            { multi: 1.2, name: "1.2X" },
            { multi: 2.0, name: "2.0X" },
            { multi: 0, name: "0X LOST" },
            { multi: 5.0, name: "5.0X" },
            { multi: 10.0, name: "10X" },
            { multi: 100.0, name: "100X GRAND JACKPOT" }
        ];

        const targetIndex = Math.floor(Math.random() * multipliers.length);
        const selected = multipliers[targetIndex];

        currentRotation += 1440 + (targetIndex * 60);
        const wheel = document.getElementById("wheelGraphic");
        if (wheel) wheel.style.transform = `rotate(${currentRotation}deg)`;

        let soundTickCount = 0;
        const tickInterval = setInterval(() => {
            if (window.CasinoAudio) window.CasinoAudio.playTick();
            soundTickCount++;
            if (soundTickCount > 25) clearInterval(tickInterval);
        }, 120);

        setTimeout(() => {
            btn.disabled = false;
            if (selected.multi > 0) {
                const won = Math.floor(bet * selected.multi);
                window.game.balance += won;
                if (window.CasinoAudio) window.CasinoAudio.playWin();
                window.showCasinoModal(true, `Fortune Wheel: ${selected.name}!`, "₹" + won, "🌟");
            } else {
                window.showCasinoModal(false, "Wheel Stopped at 0X", "₹" + bet, "🌟");
            }

            window.updateBalance();
            window.saveGame();
        }, 3200);
    };
})();
                   
