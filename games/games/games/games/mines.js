/* MODULE: CYBER MINES 2.0 (DELUXE UI & ANIMATIONS) */
(function initMinesModule() {
    console.log("💣 Cyber Mines Deluxe Engine Loaded!");
    const container = document.getElementById("game-mines");
    if(!container) return;

    let mineLocations = [];
    let minesActive = false;
    let minesBetAmt = 0;
    let gemsFound = 0;
    let currentMinesWin = 0;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:14px; color:var(--neon-blue); font-weight:700;">💣 Cyber Mines 5x5</span>
                <span style="font-size:11px; color:#94a3b8;">Level 2 Unlocked</span>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:12px;">
                <input type="number" id="minesBetInput" value="300" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('minesBetInput').value = Math.floor(Number(document.getElementById('minesBetInput').value)*2)" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px;">2X</button>
                <button onclick="document.getElementById('minesBetInput').value = window.game.balance" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px;">MAX</button>
            </div>

            <button id="startMinesBtn" onclick="window.startDeluxeMines()" style="width:100%; padding:12px; background:var(--neon-blue); color:#000; font-weight:800; border-radius:10px; margin-bottom:12px; font-size:15px;">START MINES ROUND</button>
            <button id="cashoutMinesBtn" onclick="window.cashoutDeluxeMines()" style="width:100%; padding:12px; background:var(--neon-gold); color:#000; font-weight:800; border-radius:10px; margin-bottom:12px; font-size:15px; display:none;">💰 CASHOUT (₹0)</button>

            <!-- 5x5 Interactive Tile Grid -->
            <div id="minesDeluxeGrid" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:8px; margin:10px 0;"></div>
        </div>
    `;

    window.startDeluxeMines = function() {
        minesBetAmt = Number(document.getElementById("minesBetInput").value) || 300;
        if (window.game.balance < minesBetAmt) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

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

        while (mineLocations.length < 3) {
            let r = Math.floor(Math.random() * 25);
            if (!mineLocations.includes(r)) mineLocations.push(r);
        }

        const grid = document.getElementById("minesDeluxeGrid");
        grid.innerHTML = "";
        for (let i = 0; i < 25; i++) {
            const tile = document.createElement("div");
            tile.style.cssText = "background:#1e293b; border-radius:10px; aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:22px; cursor:pointer; border:1px solid #334155; transition:all 0.2s;";
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
            minesActive = false;
            document.getElementById("startMinesBtn").style.display = "block";
            document.getElementById("cashoutMinesBtn").style.display = "none";
            window.showCasinoModal(false, "Bomb Exploded!", "₹" + minesBetAmt, "💣");
        } else {
            el.innerText = "💎";
            el.style.background = "#10b981";
            gemsFound++;
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

        document.getElementById("startMinesBtn").style.display = "block";
        document.getElementById("cashoutMinesBtn").style.display = "none";
        window.showCasinoModal(true, `Mines Cleared (${gemsFound} Gems)!`, "₹" + currentMinesWin, "💎");
    };
})();
 
