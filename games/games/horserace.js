/* MODULE: CYBER DERBY HORSE RACE */
(function initHorseRaceModule() {
    console.log("🐎 Cyber Derby Race Engine Loaded!");
    const container = document.getElementById("game-horserace");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:14px; color:var(--neon-gold); font-weight:700;">🐎 Cyber Derby Race</span>
                <span style="font-size:11px; color:var(--neon-gold);">Super VIP Exclusive</span>
            </div>

            <!-- Race Track Visual -->
            <div style="background:#050811; border:1px solid #334155; border-radius:14px; padding:12px; margin:12px 0; text-align:left;">
                <div style="margin-bottom:8px; font-size:12px; color:#fff;" id="horseTrack1">🔴 #1 Cyber Thunder: 🐎 ------------------- 🏁</div>
                <div style="margin-bottom:8px; font-size:12px; color:#fff;" id="horseTrack2">🟢 #2 Neon Runner: 🐎 ------------------- 🏁</div>
                <div style="font-size:12px; color:#fff;" id="horseTrack3">🔵 #3 Velocity Blade: 🐎 ------------------- 🏁</div>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:12px;">
                <input type="number" id="horseBetInput" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('horseBetInput').value = Math.floor(Number(document.getElementById('horseBetInput').value)*2)" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px;">2X</button>
                <button onclick="document.getElementById('horseBetInput').value = window.game.balance" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px;">MAX</button>
            </div>

            <!-- Horse Bet Buttons -->
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:6px;">
                <button onclick="window.startDerbyRace(1)" style="padding:12px 4px; background:#ef4444; color:#fff; font-weight:800; border-radius:8px; font-size:11px;">#1 THUNDER (3X)</button>
                <button onclick="window.startDerbyRace(2)" style="padding:12px 4px; background:#10b981; color:#000; font-weight:800; border-radius:8px; font-size:11px;">#2 NEON (3X)</button>
                <button onclick="window.startDerbyRace(3)" style="padding:12px 4px; background:#3b82f6; color:#fff; font-weight:800; border-radius:8px; font-size:11px;">#3 BLADE (3X)</button>
            </div>
        </div>
    `;

    window.startDerbyRace = function(chosenHorse) {
        const bet = Number(document.getElementById("horseBetInput").value) || 500;
        if (window.game.balance < bet) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        window.game.balance -= bet;
        window.updateBalance();
        window.addXP(60);

        const winner = Math.floor(Math.random() * 3) + 1;

        setTimeout(() => {
            if (chosenHorse === winner) {
                const won = bet * 3;
                window.game.balance += won;
                window.showCasinoModal(true, `Horse #${winner} Won Race!`, "₹" + won, "🐎");
            } else {
                window.showCasinoModal(false, `Horse #${winner} Won Race`, "₹" + bet, "🐎");
            }

            window.updateBalance();
            window.saveGame();
        }, 400);
    };
})();

