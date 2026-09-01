/* MODULE: ULTIMATE COLOR PREDICTION 2.0 (SUPER GRAPHICS) */
(function initColorPredictionModule() {
    console.log("🎨 Deluxe Color Prediction Engine Loaded!");
    const container = document.getElementById("game-color");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px;">
            <!-- Timer & Round Header -->
            <div style="background:linear-gradient(135deg, #1e293b, #0f172a); border:1px solid var(--neon-blue); border-radius:12px; padding:12px; text-align:center; margin-bottom:15px;">
                <span style="font-size:11px; color:#94a3b8; letter-spacing:1px; text-transform:uppercase;">WinGo 30s Speed Round</span>
                <h2 style="font-size:28px; color:var(--neon-blue); margin:4px 0;">⏱️ <span id="timerClock">30</span>s</h2>
            </div>

            <!-- Bet Amount Selector -->
            <div style="margin-bottom:15px;">
                <p style="font-size:11px; color:#94a3b8; margin-bottom:6px;">SELECT BET CHIPS</p>
                <div style="display:flex; justify-content:center; gap:8px;">
                    <button onclick="window.setBet(100)" class="chip-btn" style="padding:8px 14px; background:#1e293b; color:var(--neon-blue); border:1px solid var(--neon-blue); border-radius:8px;">100</button>
                    <button onclick="window.setBet(500)" class="chip-btn" style="padding:8px 14px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px;">500</button>
                    <button onclick="window.setBet(1000)" class="chip-btn" style="padding:8px 14px; background:#1e293b; color:var(--neon-green); border:1px solid var(--neon-green); border-radius:8px;">1K</button>
                    <button onclick="window.setBet(5000)" class="chip-btn" style="padding:8px 14px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px;">5K</button>
                </div>
            </div>

            <!-- Color Buttons -->
            <p style="font-size:11px; color:#94a3b8; margin-bottom:6px;">COLOR BET (2X - 4.5X)</p>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:15px;">
                <button onclick="window.setColor('GREEN')" style="padding:12px; background:var(--neon-green); color:#000; font-weight:800; border-radius:10px;">GREEN (2X)</button>
                <button onclick="window.setColor('VIOLET')" style="padding:12px; background:var(--neon-purple); color:#fff; font-weight:800; border-radius:10px;">VIOLET (4.5X)</button>
                <button onclick="window.setColor('RED')" style="padding:12px; background:var(--neon-red); color:#fff; font-weight:800; border-radius:10px;">RED (2X)</button>
            </div>

            <!-- Big / Small Buttons -->
            <p style="font-size:11px; color:#94a3b8; margin-bottom:6px;">SIZE BET (2X)</p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
                <button onclick="window.setSize('BIG')" style="padding:12px; background:linear-gradient(135deg, #f59e0b, #d97706); color:#000; font-weight:800; border-radius:10px;">BIG (5-9)</button>
                <button onclick="window.setSize('SMALL')" style="padding:12px; background:linear-gradient(135deg, #3b82f6, #1d4ed8); color:#fff; font-weight:800; border-radius:10px;">SMALL (0-4)</button>
            </div>

            <!-- Number Grid (0-9) -->
            <p style="font-size:11px; color:#94a3b8; margin-bottom:6px;">NUMBER BET (9X BONUS)</p>
            <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:8px; margin-bottom:12px;">
                ${[0,1,2,3,4,5,6,7,8,9].map(num => `
                    <button onclick="window.setNumber(${num})" style="padding:10px; background:#1f293d; color:#fff; font-weight:800; border:1px solid #334155; border-radius:8px; font-size:16px;">${num}</button>
                `).join('')}
            </div>

            <!-- Status Indicator -->
            <div id="playStatus" style="font-size:12px; color:var(--neon-blue); font-weight:600; min-height:20px; text-align:center;">
                Tap Chips & Choice to Bet!
            </div>
        </div>
    `;
})();
