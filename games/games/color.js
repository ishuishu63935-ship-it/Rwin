/* MODULE: COLOR PREDICTION 3.0 (WINGO / 91CLUB DELUXE ENGINE) */
(function initColorPredictionModule() {
    console.log("🎨 WinGo Color Prediction 3.0 Engine Loaded!");
    const container = document.getElementById("game-color");
    if (!container) return;

    let selectedBetType = null; // 'GREEN', 'RED', 'VIOLET', 'BIG', 'SMALL', or number 0-9
    let timerSeconds = 30;
    let colorTimer = null;
    let historyData = [
        { period: "20260903080", num: 7, color: "GREEN", size: "BIG" },
        { period: "20260903079", num: 2, color: "RED", size: "SMALL" },
        { period: "20260903078", num: 0, color: "VIOLET", size: "SMALL" },
        { period: "20260903077", num: 9, color: "GREEN", size: "BIG" },
        { period: "20260903076", num: 4, color: "RED", size: "SMALL" }
    ];

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <!-- Top Header & Period Banner -->
            <div style="display:flex; justify-content:space-between; align-items:center; background:#050811; padding:10px 14px; border-radius:12px; border:1px solid #1e293b; margin-bottom:14px;">
                <div style="text-align:left;">
                    <div style="font-size:10px; color:#94a3b8;">PERIOD ID</div>
                    <div id="wingoPeriodId" style="font-size:14px; font-weight:800; color:var(--neon-blue);">20260903081</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:10px; color:#94a3b8;">COUNTDOWN</div>
                    <div id="wingoTimer" style="font-size:22px; font-weight:800; color:var(--neon-green);">00:30</div>
                </div>
            </div>

            <!-- Quick Color Bet Buttons -->
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:12px;">
                <button onclick="window.selectColorBet('GREEN')" style="padding:12px; background:var(--neon-green); color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer;">GREEN (2X)</button>
                <button onclick="window.selectColorBet('VIOLET')" style="padding:12px; background:#8b5cf6; color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer;">VIOLET (4.5X)</button>
                <button onclick="window.selectColorBet('RED')" style="padding:12px; background:#ef4444; color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer;">RED (2X)</button>
            </div>

            <!-- Numbers Selection Grid (0 to 9) -->
            <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; margin-bottom:12px;">
                ${[0,1,2,3,4,5,6,7,8,9].map(n => `
                    <button onclick="window.selectColorBet(${n})" style="padding:10px 0; background:#1e293b; color:#fff; font-weight:800; border-radius:8px; border:1px solid #334155; cursor:pointer;">${n}</button>
                `).join('')}
            </div>

            <!-- Big / Small Buttons -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px;">
                <button onclick="window.selectColorBet('BIG')" style="padding:10px; background:#f59e0b; color:#000; font-weight:800; border-radius:8px; border:none; cursor:pointer;">BIG (5-9) [2X]</button>
                <button onclick="window.selectColorBet('SMALL')" style="padding:10px; background:#3b82f6; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">SMALL (0-4) [2X]</button>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:12px;">
                <input type="number" id="colorBetAmount" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('colorBetAmount').value = Math.floor(Number(document.getElementById('colorBetAmount').value)*2)" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                <button onclick="document.getElementById('colorBetAmount').value = window.game.balance" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
            </div>

            <div id="selectedBetLabel" style="font-size:12px; color:#94a3b8; margin-bottom:10px;">Select an option to place bet</div>

            <!-- Trend History Chart (WinGo Style) -->
            <div style="margin-top:16px; background:#050811; border:1px solid #1e293b; border-radius:12px; padding:12px; text-align:left;">
                <div style="font-size:12px; font-weight:800; color:var(--neon-gold); margin-bottom:8px;">📊 TREND HISTORY</div>
                <div style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr; font-size:10px; color:#94a3b8; border-bottom:1px solid #1e293b; padding-bottom:4px; font-weight:700;">
                    <span>Period</span><span>Number</span><span>Color</span><span>Size</span>
                </div>
                <div id="colorHistoryRows"></div>
            </div>
        </div>
    `;

    function renderHistoryRows() {
        const rowsContainer = document.getElementById("colorHistoryRows");
        if (!rowsContainer) return;
        rowsContainer.innerHTML = historyData.map(h => `
            <div style="display:grid; grid-template-columns:2fr 1fr 1fr 1fr; font-size:11px; padding:6px 0; border-bottom:1px dashed #1e293b; align-items:center;">
                <span style="color:#cbd5e1; font-weight:600;">${h.period}</span>
                <span style="font-weight:800; color:#fff;">${h.num}</span>
                <span style="font-weight:800; color:${h.color === 'GREEN' ? 'var(--neon-green)' : h.color === 'RED' ? '#ef4444' : '#8b5cf6'};">${h.color}</span>
                <span style="font-weight:700; color:#94a3b8;">${h.size}</span>
            </div>
        `).join('');
    }

    window.selectColorBet = function(type) {
        selectedBetType = type;
        if (window.CasinoAudio) window.CasinoAudio.playChip();
        document.getElementById("selectedBetLabel").innerHTML = `<b style="color:var(--neon-blue);">SELECTED BET:</b> ${type}`;
    };

    function startTimer() {
        if (colorTimer) clearInterval(colorTimer);
        timerSeconds = 30;

        colorTimer = setInterval(() => {
            timerSeconds--;
            const timerEl = document.getElementById("wingoTimer");
            if (timerEl) {
                timerEl.innerText = `00:${timerSeconds.toString().padStart(2, '0')}`;
                if (timerSeconds <= 5) {
                    timerEl.style.color = "#ef4444";
                    if (window.CasinoAudio) window.CasinoAudio.playTick();
                } else {
                    timerEl.style.color = "var(--neon-green)";
                }
            }

            if (timerSeconds <= 0) {
                evaluateRound();
                timerSeconds = 30;
            }
        }, 1000);
    }

    function evaluateRound() {
        const currentPeriod = window.PeriodEngine ? window.PeriodEngine.getPeriodId() : "20260903081";
        document.getElementById("wingoPeriodId").innerText = Number(currentPeriod) + 1;

        const drawnNum = Math.floor(Math.random() * 10);
        const drawnColor = (drawnNum === 0 || drawnNum === 5) ? "VIOLET" : (drawnNum % 2 === 0 ? "RED" : "GREEN");
        const drawnSize = drawnNum >= 5 ? "BIG" : "SMALL";

        // Add to history
        historyData.unshift({ period: currentPeriod, num: drawnNum, color: drawnColor, size: drawnSize });
        if (historyData.length > 8) historyData.pop();
        renderHistoryRows();

        const betAmt = Number(document.getElementById("colorBetAmount").value) || 500;

        if (selectedBetType !== null) {
            let isWin = false;
            let winMultiplier = 2;

            if (selectedBetType === drawnColor || selectedBetType === drawnSize) {
                isWin = true;
            } else if (typeof selectedBetType === 'number' && selectedBetType === drawnNum) {
                isWin = true;
                winMultiplier = 9;
            }

            if (isWin) {
                const wonAmt = Math.floor(betAmt * winMultiplier);
                window.game.balance += wonAmt;
                if (window.CasinoAudio) window.CasinoAudio.playWin();
                window.showCasinoModal(true, `Period ${currentPeriod} WIN!`, "₹" + wonAmt, "🎨");
            } else {
                window.showCasinoModal(false, `Period ${currentPeriod} Result`, "₹" + betAmt, "💥");
            }

            window.updateBalance();
            window.saveGame();
            selectedBetType = null;
            document.getElementById("selectedBetLabel").innerText = "Choose Coins + Bet Option for Next Round";
        }
    }

    renderHistoryRows();
    startTimer();
})();
            
