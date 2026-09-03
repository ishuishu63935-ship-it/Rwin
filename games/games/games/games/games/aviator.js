/* MODULE: AVIATOR CRASH 3.0 (REAL FLIGHT TRAJECTORY & AUDIO ENGINE) */
(function initAviatorModule() {
    console.log("🚀 Aviator Crash 3.0 Deluxe Engine Loaded!");
    const container = document.getElementById("game-aviator");
    if (!container) return;

    let aviatorTimer = null;
    let aviatorMulti = 1.00;
    let isFlying = false;
    let aviatorBetAmt = 0;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <!-- Flight View Display -->
            <div style="background:#050811; border:2px solid #1e293b; border-radius:14px; height:200px; position:relative; overflow:hidden; margin-bottom:15px; box-shadow:inset 0 0 30px rgba(0,0,0,0.8);">
                <div id="aviatorMultiText" style="position:absolute; top:35%; width:100%; text-align:center; font-size:44px; font-weight:800; color:var(--neon-green); text-shadow:0 0 20px rgba(16,185,129,0.5);">1.00x</div>
                <div id="aviatorJetPlane" style="position:absolute; bottom:15px; left:15px; font-size:38px; transition:all 0.1s linear; filter:drop-shadow(0 0 10px var(--neon-blue));">🚀</div>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:12px;">
                <input type="number" id="aviatorBetInput" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('aviatorBetInput').value = Math.floor(Number(document.getElementById('aviatorBetInput').value)*2); if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                <button onclick="document.getElementById('aviatorBetInput').value = window.game.balance; if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
            </div>

            <button id="startJetBtn" onclick="window.startDeluxeAviator()" style="width:100%; padding:14px; background:linear-gradient(135deg, var(--neon-green), #059669); color:#000; font-weight:800; border-radius:12px; font-size:16px; border:none; cursor:pointer; box-shadow:0 0 15px rgba(16,185,129,0.3);">🚀 LAUNCH JET</button>
            <button id="cashoutJetBtn" onclick="window.cashoutDeluxeAviator()" style="width:100%; padding:14px; background:linear-gradient(135deg, var(--neon-gold), #d97706); color:#000; font-weight:800; border-radius:12px; font-size:16px; border:none; cursor:pointer; display:none; box-shadow:0 0 15px rgba(245,158,11,0.3);">💰 CASH OUT NOW</button>
        </div>
    `;

    window.startDeluxeAviator = function() {
        aviatorBetAmt = Number(document.getElementById("aviatorBetInput").value) || 500;
        if (window.game.balance < aviatorBetAmt) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        if (window.CasinoAudio) window.CasinoAudio.playChip();

        window.game.balance -= aviatorBetAmt;
        window.updateBalance();
        window.addXP(50);

        isFlying = true;
        aviatorMulti = 1.00;

        document.getElementById("startJetBtn").style.display = "none";
        document.getElementById("cashoutJetBtn").style.display = "block";

        const crashAt = (Math.random() * 4.2 + 1.08).toFixed(2);
        const plane = document.getElementById("aviatorJetPlane");

        aviatorTimer = setInterval(() => {
            aviatorMulti += 0.04;
            const multiEl = document.getElementById("aviatorMultiText");
            if (multiEl) multiEl.innerText = aviatorMulti.toFixed(2) + "x";

            if (window.CasinoAudio && Math.random() > 0.6) window.CasinoAudio.playTick();

            if (plane) {
                let leftVal = Math.min(80, (aviatorMulti - 1) * 25 + 10);
                let bottomVal = Math.min(70, (aviatorMulti - 1) * 20 + 15);
                plane.style.left = leftVal + "%";
                plane.style.bottom = bottomVal + "%";
            }

            if (aviatorMulti >= crashAt) {
                clearInterval(aviatorTimer);
                isFlying = false;

                if (multiEl) {
                    multiEl.innerText = "💥 FLEW AWAY!";
                    multiEl.style.color = "#ef4444";
                }

                if (window.CasinoAudio) window.CasinoAudio.playTick();

                window.showCasinoModal(false, "Jet Crashed!", "₹" + aviatorBetAmt, "🚀");

                if (plane) { 
                    plane.style.left = "15px"; 
                    plane.style.bottom = "15px"; 
                }

                document.getElementById("startJetBtn").style.display = "block";
                document.getElementById("cashoutJetBtn").style.display = "none";
            }
        }, 90);
    };

    window.cashoutDeluxeAviator = function() {
        if (!isFlying) return;
        clearInterval(aviatorTimer);
        isFlying = false;

        const winAmt = Math.floor(aviatorBetAmt * aviatorMulti);
        window.game.balance += winAmt;
        window.addXP(100);
        window.updateBalance();
        window.saveGame();

        if (window.CasinoAudio) window.CasinoAudio.playWin();

        window.showCasinoModal(true, `Cashed Out at ${aviatorMulti.toFixed(2)}x!`, "₹" + winAmt, "✈️");
        
        document.getElementById("startJetBtn").style.display = "block";
        document.getElementById("cashoutJetBtn").style.display = "none";
    };
})();
