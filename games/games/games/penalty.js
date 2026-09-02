/* MODULE: PENALTY SHOOTOUT DELUXE */
(function initPenaltyModule() {
    console.log("⚽ Penalty Shootout Engine Loaded!");
    const container = document.getElementById("game-penalty");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:14px; color:var(--neon-blue); font-weight:700;">⚽ Penalty Kick Shootout</span>
                <span style="font-size:11px; color:var(--neon-gold);">Super VIP Exclusive</span>
            </div>

            <!-- Goal Net Display -->
            <div style="background:linear-gradient(180deg, #1e293b, #050811); border:2px solid #334155; border-radius:14px; padding:20px 10px; margin:12px 0; position:relative;">
                <div id="keeperGraphic" style="font-size:36px; margin-bottom:15px; transition:transform 0.2s;">🧤</div>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
                    <button onclick="window.shootPenalty('TL')" style="padding:10px; background:#0f172a; border:1px dashed var(--neon-blue); color:#fff; border-radius:8px; font-weight:700;">↖️ TOP LEFT</button>
                    <button onclick="window.shootPenalty('CTR')" style="padding:10px; background:#0f172a; border:1px dashed var(--neon-gold); color:#fff; border-radius:8px; font-weight:700;">⬆️ CENTER</button>
                    <button onclick="window.shootPenalty('TR')" style="padding:10px; background:#0f172a; border:1px dashed var(--neon-blue); color:#fff; border-radius:8px; font-weight:700;">↗️ TOP RIGHT</button>
                    <button onclick="window.shootPenalty('BL')" style="padding:10px; background:#0f172a; border:1px dashed var(--neon-green); color:#fff; border-radius:8px; font-weight:700;">↙️ BTM LEFT</button>
                    <div style="font-size:28px; display:flex; align-items:center; justify-content:center;">⚽</div>
                    <button onclick="window.shootPenalty('BR')" style="padding:10px; background:#0f172a; border:1px dashed var(--neon-green); color:#fff; border-radius:8px; font-weight:700;">↘️ BTM RIGHT</button>
                </div>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:12px;">
                <input type="number" id="penaltyBetInput" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('penaltyBetInput').value = Math.floor(Number(document.getElementById('penaltyBetInput').value)*2)" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px;">2X</button>
                <button onclick="document.getElementById('penaltyBetInput').value = window.game.balance" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px;">MAX</button>
            </div>
        </div>
    `;

    window.shootPenalty = function(targetSpot) {
        const bet = Number(document.getElementById("penaltyBetInput").value) || 500;
        if (window.game.balance < bet) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        window.game.balance -= bet;
        window.updateBalance();
        window.addXP(65);

        const keeperSpots = ['TL', 'CTR', 'TR', 'BL', 'BR'];
        const keeperDive = keeperSpots[Math.floor(Math.random() * keeperSpots.length)];
        const keeperEl = document.getElementById("keeperGraphic");

        if (keeperDive === 'TL' || keeperDive === 'BL') keeperEl.style.transform = "translateX(-60px)";
        else if (keeperDive === 'TR' || keeperDive === 'BR') keeperEl.style.transform = "translateX(60px)";
        else keeperEl.style.transform = "translateX(0deg)";

        setTimeout(() => {
            keeperEl.style.transform = "translateX(0deg)";
            if (targetSpot !== keeperDive) {
                const won = bet * 2;
                window.game.balance += won;
                window.showCasinoModal(true, "GOAL SCORED (2X)!", "₹" + won, "⚽");
            } else {
                window.showCasinoModal(false, "Saved by Keeper!", "₹" + bet, "🧤");
            }

            window.updateBalance();
            window.saveGame();
        }, 300);
    };
})();
