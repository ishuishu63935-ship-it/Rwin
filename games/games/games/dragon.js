/* MODULE: DRAGON VS TIGER 3.0 (DELUXE AUDIO & CARD ARENA) */
(function initDragonModule() {
    console.log("🐉 Dragon vs Tiger 3.0 Engine Loaded!");
    const container = document.getElementById("game-dragon");
    if (!container) return;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <!-- Header Bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:#050811; padding:10px 14px; border-radius:12px; border:1px solid #1e293b;">
                <span style="font-size:14px; color:var(--neon-gold); font-weight:800;">🐉 Dragon vs 🐯 Tiger</span>
                <span style="font-size:11px; color:#94a3b8; font-weight:600;">LVL 2 Required</span>
            </div>

            <!-- Card Arena Display -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:15px 0;">
                <div style="background:rgba(239, 68, 68, 0.1); border:2px solid var(--neon-red); border-radius:14px; padding:15px;">
                    <div style="font-size:12px; color:var(--neon-red); font-weight:800; margin-bottom:8px;">🐉 DRAGON</div>
                    <div id="dragonCardVal" style="font-size:42px; font-weight:800; min-height:60px; display:flex; align-items:center; justify-content:center; color:#fff; text-shadow:0 0 10px rgba(239,68,68,0.5);">🎴</div>
                </div>
                <div style="background:rgba(245, 158, 11, 0.1); border:2px solid var(--neon-gold); border-radius:14px; padding:15px;">
                    <div style="font-size:12px; color:var(--neon-gold); font-weight:800; margin-bottom:8px;">🐯 TIGER</div>
                    <div id="tigerCardVal" style="font-size:42px; font-weight:800; min-height:60px; display:flex; align-items:center; justify-content:center; color:#fff; text-shadow:0 0 10px rgba(245,158,11,0.5);">🎴</div>
                </div>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:14px;">
                <input type="number" id="dragonBetInput" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('dragonBetInput').value = Math.floor(Number(document.getElementById('dragonBetInput').value)*2); if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                <button onclick="document.getElementById('dragonBetInput').value = window.game.balance; if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
            </div>

            <!-- Bet Selection Buttons -->
            <div style="display:grid; grid-template-columns:2fr 1fr 2fr; gap:8px;">
                <button onclick="window.playDragonVsTiger('DRAGON')" style="padding:14px 8px; background:linear-gradient(135deg, #ef4444, #b91c1c); color:#fff; font-weight:800; border-radius:12px; border:none; cursor:pointer; box-shadow:0 0 10px rgba(239,68,68,0.3);">DRAGON (2X)</button>
                <button onclick="window.playDragonVsTiger('TIE')" style="padding:14px 8px; background:linear-gradient(135deg, var(--neon-green), #047857); color:#000; font-weight:800; border-radius:12px; border:none; cursor:pointer; box-shadow:0 0 10px rgba(16,185,129,0.3);">TIE (9X)</button>
                <button onclick="window.playDragonVsTiger('TIGER')" style="padding:14px 8px; background:linear-gradient(135deg, var(--neon-gold), #b45309); color:#000; font-weight:800; border-radius:12px; border:none; cursor:pointer; box-shadow:0 0 10px rgba(245,158,11,0.3);">TIGER (2X)</button>
            </div>
        </div>
    `;

    window.playDragonVsTiger = function(choice) {
        const bet = Number(document.getElementById("dragonBetInput").value) || 500;
        if (window.game.balance < bet) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        if (window.CasinoAudio) window.CasinoAudio.playChip();

        window.game.balance -= bet;
        window.updateBalance();
        window.addXP(80);

        const cardIcons = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
        const dVal = Math.floor(Math.random() * 13) + 1;
        const tVal = Math.floor(Math.random() * 13) + 1;

        const dCardEl = document.getElementById("dragonCardVal");
        const tCardEl = document.getElementById("tigerCardVal");

        dCardEl.innerText = "🎴";
        tCardEl.innerText = "🎴";

        setTimeout(() => {
            dCardEl.innerText = cardIcons[dVal - 1];
            tCardEl.innerText = cardIcons[tVal - 1];

            let outcome = "TIE";
            if (dVal > tVal) outcome = "DRAGON";
            else if (tVal > dVal) outcome = "TIGER";

            if (choice === outcome) {
                const multi = outcome === "TIE" ? 9 : 2;
                const won = Math.floor(bet * multi);
                window.game.balance += won;
                if (window.CasinoAudio) window.CasinoAudio.playWin();
                window.showCasinoModal(true, `${outcome} WON!`, "₹" + won, outcome === "DRAGON" ? "🐉" : outcome === "TIGER" ? "🐯" : "🤝");
            } else {
                if (window.CasinoAudio) window.CasinoAudio.playTick();
                window.showCasinoModal(false, `${outcome} Won Round`, "₹" + bet, "💥");
            }

            window.updateBalance();
            window.saveGame();
        }, 300);
    };
})();
