/* MODULE: CHICKEN ROAD CROSS DELUXE */
(function initChickenCrossModule() {
    console.log("🐔 Chicken Road Cross Engine Loaded!");
    const container = document.getElementById("game-chickencross");
    if(!container) return;

    let chickenStep = 0;
    let chickenActive = false;
    let chickenBetAmt = 0;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:14px; color:var(--neon-gold); font-weight:700;">🐔 Chicken Road Cross</span>
                <span style="font-size:11px; color:var(--neon-gold);">Super VIP Exclusive</span>
            </div>

            <!-- Road Cross Lanes Display -->
            <div style="background:#050811; border:1px solid #334155; border-radius:14px; padding:15px; margin:12px 0;">
                <div id="chickenLaneDisplay" style="font-size:26px; min-height:50px; display:flex; align-items:center; justify-content:space-around; background:#1f293d; border-radius:10px; padding:10px;">
                    <span>🏁</span><span>🚗</span><span>🏎️</span><span>🚛</span><span>🐔</span>
                </div>
                <div style="font-size:12px; color:var(--neon-green); font-weight:700; margin-top:8px;" id="chickenMultiText">Current Multiplier: 1.00X</div>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:12px;">
                <input type="number" id="chickenBetInput" value="300" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('chickenBetInput').value = Math.floor(Number(document.getElementById('chickenBetInput').value)*2)" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px;">2X</button>
                <button onclick="document.getElementById('chickenBetInput').value = window.game.balance" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px;">MAX</button>
            </div>

            <button id="startChickenBtn" onclick="window.startChickenGame()" style="width:100%; padding:14px; background:var(--neon-green); color:#000; font-weight:800; border-radius:12px; font-size:16px;">🐔 START ROAD CROSS</button>
            
            <div id="chickenActionRow" style="display:none; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
                <button onclick="window.stepChickenForward()" style="padding:12px; background:var(--neon-blue); color:#000; font-weight:800; border-radius:10px;">👟 CROSS LANE</button>
                <button id="cashoutChickenBtn" onclick="window.cashoutChicken()" style="padding:12px; background:var(--neon-gold); color:#000; font-weight:800; border-radius:10px;">💰 CASHOUT</button>
            </div>
        </div>
    `;

    window.startChickenGame = function() {
        chickenBetAmt = Number(document.getElementById("chickenBetInput").value) || 300;
        if (window.game.balance < chickenBetAmt) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        window.game.balance -= chickenBetAmt;
        window.updateBalance();
        window.addXP(40);

        chickenActive = true;
        chickenStep = 0;

        document.getElementById("startChickenBtn").style.display = "none";
        document.getElementById("chickenActionRow").style.display = "grid";
        document.getElementById("chickenMultiText").innerText = "Current Multiplier: 1.20X";
    };

    window.stepChickenForward = function() {
        if (!chickenActive) return;

        const isHit = Math.random() < 0.25; // 25% chance vehicle hit
        if (isHit) {
            chickenActive = false;
            document.getElementById("startChickenBtn").style.display = "block";
            document.getElementById("chickenActionRow").style.display = "none";
            window.showCasinoModal(false, "Chicken Hit by Truck!", "₹" + chickenBetAmt, "💥");
        } else {
            chickenStep++;
            const multi = (1 + (chickenStep * 0.4)).toFixed(2);
            document.getElementById("chickenMultiText").innerText = `Current Multiplier: ${multi}X`;
            document.getElementById("cashoutChickenBtn").innerText = `💰 CASHOUT (₹${Math.floor(chickenBetAmt * multi)})`;
        }
    };

    window.cashoutChicken = function() {
        if (!chickenActive || chickenStep === 0) return;
        chickenActive = false;
        const multi = (1 + (chickenStep * 0.4));
        const won = Math.floor(chickenBetAmt * multi);

        window.game.balance += won;
        window.addXP(70);
        window.updateBalance();
        window.saveGame();

        document.getElementById("startChickenBtn").style.display = "block";
        document.getElementById("chickenActionRow").style.display = "none";
        window.showCasinoModal(true, `Safe Cross (${multi.toFixed(2)}X)!`, "₹" + won, "🐔");
    };
})();
                                
