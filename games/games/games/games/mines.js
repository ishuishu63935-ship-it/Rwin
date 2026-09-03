/* MODULE: CYBER MINES 3.0 (DELUXE AUDIO & MULTI-GRID ENGINE) */
(function initMinesModule() {
    console.log("💣 Cyber Mines 3.0 Deluxe Engine Loaded!");
    const container = document.getElementById("game-mines");
    if (!container) return;

    let mineLocations = [];
    let minesActive = false;
    let minesBetAmt = 0;
    let gemsFound = 0;
    let currentMinesWin = 0;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <!-- Header & Level Info -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:#050811; padding:10px 14px; border-radius:12px; border:1px solid #1e293b;">
                <span style="font-size:14px; color:var(--neon-blue); font-weight:800;">💣 Cyber Mines 5x5</span>
                <span style="font-size:11px; color:#94a3b8; font-weight:600;">LVL 2 Required</span>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:12px;">
                <input type="number" id="minesBetInput" value="300" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('minesBetInput').value = Math.floor(Number(document.getElementById('minesBetInput').value)*2); if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                <button onclick="document.getElementById('minesBetInput').value = window.game.balance; if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
            </div>

            <button id="startMinesBtn" onclick="window.startDeluxeMines()" style="width:100%; padding:14px; background:linear-gradient(135deg, var(--neon-blue), #0284c7); color:#000; font-weight:800; border-radius:12px; margin-bottom:12px; font-size:15px; border:none; cursor:pointer; box-shadow:0 0 15px rgba(0,229,255,0.3);">💣 START MINES ROUND</button>
            <button id="cashoutMinesBtn" onclick="window.cashoutDeluxeMines()" style="width:100%; padding:14px; background:linear-gradient(135deg, var(--neon-gold), #d97706); color:#000; font-weight:800; border-radius:12px; margin-bottom:12px; font-size:15px; border:none; cursor:pointer; display:none; box-shadow:0 0 15px rgba(245,158,11,0.3);">💰 CASHOUT (₹0)</button>

            <!-- 5x5 Grid Area -->
            <div id="minesDeluxeGrid" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:8px; margin:10px 0;"></div>
        </div>
    `;

    window.startDeluxeMines = function() {
        minesBetAmt = Number(document.getElementById("minesBetInput").value) || 300;
        if (window.game.balance < minesBetAmt) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        if (window.CasinoAudio) window.CasinoAudio.playChip();

        window.game.balance -= minesBetAmt;
        window.updateBalance();
        window.addXP(40);

        minesActive = true;
        gemsFound = 0;
        currentMinesWin = 0;
        mineLocations = [];

        document.getElementById("startMinesBtn").style.display = "none";
        const coBtn = document.getElementById("cashoutMinesBtn");
        coBtn.style.display = "block";
        coBtn.innerText = "💰 CASHOUT (₹0)";

        // Set 3 hidden bomb locations
        while (mineLocations.length < 3) {
            let r = Math.floor(Math.random() * 25);
            if (!mineLocations.includes(r)) mineLocations.push(r);
        }

        const grid = document.getElementById("minesDeluxeGrid");
        grid.innerHTML = "";
        for (let i = 0; i < 25; i++) {
            const tile = document.createElement("div");
            tile.style.cssText = "background:#1e293b; border-radius:10px; aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:20px; cursor:pointer; border:1px solid #334155; transition:all 0.15s ease;";
            tile.innerText = "❓";
            tile.onclick = () => revealDeluxeMine(tile, i);
            grid.appendChild(tile);
        }
    };

    function revealDeluxeMine(el, idx) {
        if (!minesActive || el.innerText !== "❓") return;

        if (mineLocations.includes(idx)) {
            el.innerText = "💣";
            el.style.background = "#ef4444";
            el.style.borderColor = "#f87171";
            minesActive = false;
            
            if (window.CasinoAudio) window.CasinoAudio.playTick();

            document.getElementById("startMinesBtn").style.display = "block";
            document.getElementById("cashoutMinesBtn").style.display = "none";
            window.showCasinoModal(false, "Bomb Exploded!", "₹" + minesBetAmt, "💣");
        } else {
            el.innerText = "💎";
            el.style.background = "#10b981";
            el.style.borderColor = "#34d399";
            gemsFound++;

            if (window.CasinoAudio) window.CasinoAudio.playChip();

            let multi = (1 + (gemsFound * 0.35)).toFixed(2);
            currentMinesWin = Math.floor(minesBetAmt * multi);

            const coBtn = document.getElementById("cashoutMinesBtn");
            coBtn.innerText = `💰 CASHOUT (₹${currentMinesWin}) [${multi}X]`;
        }
    }

    window.cashoutDeluxeMines = function() {
        if (!minesActive || gemsFound === 0) return;
        minesActive = false;
        
        window.game.balance += currentMinesWin;
        window.addXP(80);
        window.updateBalance();
        window.saveGame();

        if (window.CasinoAudio) window.CasinoAudio.playWin();

        document.getElementById("startMinesBtn").style.display = "block";
        document.getElementById("cashoutMinesBtn").style.display = "none";
        window.showCasinoModal(true, `Mines Cleared (${gemsFound} Gems)!`, "₹" + currentMinesWin, "💎");
    };
})();
