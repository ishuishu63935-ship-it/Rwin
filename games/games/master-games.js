/* RWIN VIP CASINO - REAL INTERACTIVE GAME ENGINE 3.0 */
(function initMasterEngine() {
    console.log("🔥 RWIN 3.0 Real Casino Engine Loaded!");

    window.loadMasterGameView = function(gameId) {
        const container = document.getElementById("game-" + gameId);
        if (!container) return;

        if (!window.game) window.game = { balance: 10000, level: 1 };

        // ==========================================
        // 1. WINGO COLOR PREDICTION (FULL 0-9 + BIG/SMALL)
        // ==========================================
        if (gameId === 'color') {
            container.innerHTML = `
                <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:16px; text-align:center;">
                    <!-- Period & Timer -->
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#050811; padding:10px 14px; border-radius:12px; margin-bottom:12px; border:1px solid #1e293b;">
                        <div style="text-align:left;">
                            <div style="font-size:10px; color:#94a3b8;">PERIOD</div>
                            <div style="font-size:12px; font-weight:800; color:var(--neon-blue);" id="wingoPeriod">20260906001</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:10px; color:#94a3b8;">COUNTDOWN</div>
                            <div style="font-size:20px; font-weight:800; color:var(--neon-green);" id="wingoTimer">00:30</div>
                        </div>
                    </div>

                    <!-- Main Colors (2X / 4.5X) -->
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:10px;">
                        <button onclick="playWinGo('GREEN', 2)" style="padding:12px; background:#10b981; color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer;">Green (2X)</button>
                        <button onclick="playWinGo('VIOLET', 4.5)" style="padding:12px; background:#8b5cf6; color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer;">Violet (4.5X)</button>
                        <button onclick="playWinGo('RED', 2)" style="padding:12px; background:#ef4444; color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer;">Red (2X)</button>
                    </div>

                    <!-- Big / Small (2X) -->
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:12px;">
                        <button onclick="playWinGo('BIG', 2)" style="padding:10px; background:#f59e0b; color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer; font-size:13px;">BIG (5-9) 2X</button>
                        <button onclick="playWinGo('SMALL', 2)" style="padding:10px; background:#3b82f6; color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer; font-size:13px;">SMALL (0-4) 2X</button>
                    </div>

                    <!-- Number Grid (0-9) - 9X Payout -->
                    <div style="font-size:11px; color:#94a3b8; margin-bottom:6px; font-weight:600; text-align:left;">SELECT NUMBER (9X PAYOUT):</div>
                    <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; margin-bottom:14px;">
                        <button onclick="playWinGo(0, 9)" style="padding:10px; background:linear-gradient(135deg, #ef4444, #8b5cf6); color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">0</button>
                        <button onclick="playWinGo(1, 9)" style="padding:10px; background:#10b981; color:#000; font-weight:800; border-radius:8px; border:none; cursor:pointer;">1</button>
                        <button onclick="playWinGo(2, 9)" style="padding:10px; background:#ef4444; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">2</button>
                        <button onclick="playWinGo(3, 9)" style="padding:10px; background:#10b981; color:#000; font-weight:800; border-radius:8px; border:none; cursor:pointer;">3</button>
                        <button onclick="playWinGo(4, 9)" style="padding:10px; background:#ef4444; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">4</button>
                        <button onclick="playWinGo(5, 9)" style="padding:10px; background:linear-gradient(135deg, #10b981, #8b5cf6); color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">5</button>
                        <button onclick="playWinGo(6, 9)" style="padding:10px; background:#ef4444; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">6</button>
                        <button onclick="playWinGo(7, 9)" style="padding:10px; background:#10b981; color:#000; font-weight:800; border-radius:8px; border:none; cursor:pointer;">7</button>
                        <button onclick="playWinGo(8, 9)" style="padding:10px; background:#ef4444; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">8</button>
                        <button onclick="playWinGo(9, 9)" style="padding:10px; background:#10b981; color:#000; font-weight:800; border-radius:8px; border:none; cursor:pointer;">9</button>
                    </div>

                    <!-- Bet Bar -->
                    <div style="display:flex; gap:6px;">
                        <input type="number" id="wingoBet" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                        <button onclick="document.getElementById('wingoBet').value *= 2" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                        <button onclick="document.getElementById('wingoBet').value = window.game.balance" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
                    </div>
                </div>
            `;

            window.playWinGo = function(selection, multi) {
                const bet = Number(document.getElementById("wingoBet").value) || 500;
                if (window.game.balance < bet) return window.showCasinoModal ? window.showCasinoModal(false, "Low Balance", "0", "⚠️") : alert("Low Balance!");

                window.game.balance -= bet;
                if (window.updateBalance) window.updateBalance();

                const drawnNum = Math.floor(Math.random() * 10);
                const drawnColor = (drawnNum === 0 || drawnNum === 5) ? "VIOLET" : (drawnNum % 2 === 0 ? "RED" : "GREEN");
                const drawnSize = drawnNum >= 5 ? "BIG" : "SMALL";

                let isWin = false;
                if (typeof selection === 'number' && selection === drawnNum) isWin = true;
                if (selection === drawnColor) isWin = true;
                if (selection === drawnSize) isWin = true;

                setTimeout(() => {
                    if (isWin) {
                        const won = Math.floor(bet * multi);
                        window.game.balance += won;
                        if (window.showCasinoModal) window.showCasinoModal(true, `WIN! Drawn: ${drawnNum} (${drawnColor}/${drawnSize})`, "₹" + won, "🎯");
                        else alert(`🎉 WIN! Drawn: ${drawnNum} (${drawnColor}/${drawnSize}). Won ₹${won}`);
                    } else {
                        if (window.showCasinoModal) window.showCasinoModal(false, `Lost! Drawn: ${drawnNum} (${drawnColor}/${drawnSize})`, "₹" + bet, "💥");
                        else alert(`💥 Lost! Drawn: ${drawnNum} (${drawnColor}/${drawnSize})`);
                    }
                    if (window.updateBalance) window.updateBalance();
                    if (window.saveGame) window.saveGame();
                }, 300);
            };
            return;
        }

        // ==========================================
        // 2. CYBER MINES 5X5 GRID (INTERACTIVE GRID)
        // ==========================================
        if (gameId === 'mines') {
            let activeMines = [];
            let gemsRevealed = 0;
            let currentMulti = 1.0;
            let gameActive = false;

            container.innerHTML = `
                <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:16px; text-align:center;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-size:12px; color:#94a3b8;">MINES: <b style="color:#ef4444;">3 BOMBS</b></span>
                        <span style="font-size:14px; font-weight:800; color:var(--neon-green);" id="minesMulti">1.00x</span>
                    </div>

                    <!-- 5x5 Grid Container -->
                    <div id="minesGrid" style="display:grid; grid-template-columns:repeat(5, 1fr); gap:6px; margin-bottom:12px;"></div>

                    <div style="display:flex; gap:6px; margin-bottom:10px;">
                        <input type="number" id="minesBet" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                        <button onclick="document.getElementById('minesBet').value *= 2" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px;">2X</button>
                    </div>

                    <button id="startMinesBtn" onclick="startMinesGame()" style="width:100%; padding:12px; background:linear-gradient(135deg, var(--neon-blue), #0284c7); color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer;">START MINES ROUND</button>
                    <button id="cashoutMinesBtn" onclick="cashoutMines()" style="width:100%; padding:12px; background:linear-gradient(135deg, var(--neon-gold), #d97706); color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer; display:none;">CASHOUT</button>
                </div>
            `;

            function renderMinesGrid() {
                const grid = document.getElementById("minesGrid");
                if (!grid) return;
                grid.innerHTML = "";
                for (let i = 0; i < 25; i++) {
                    const tile = document.createElement("button");
                    tile.style.cssText = "height:48px; background:#1e293b; border:1px solid #334155; border-radius:8px; font-size:18px; cursor:pointer;";
                    tile.innerText = "❓";
                    tile.onclick = () => clickTile(i, tile);
                    grid.appendChild(tile);
                }
            }
            renderMinesGrid();

            window.startMinesGame = function() {
                const bet = Number(document.getElementById("minesBet").value) || 500;
                if (window.game.balance < bet) return alert("Low Balance!");

                window.game.balance -= bet;
                if (window.updateBalance) window.updateBalance();

                activeMines = [];
                while (activeMines.length < 3) {
                    let r = Math.floor(Math.random() * 25);
                    if (!activeMines.includes(r)) activeMines.push(r);
                }

                gemsRevealed = 0;
                currentMulti = 1.0;
                gameActive = true;

                document.getElementById("minesMulti").innerText = "1.00x";
                document.getElementById("startMinesBtn").style.display = "none";
                document.getElementById("cashoutMinesBtn").style.display = "block";
                renderMinesGrid();
            };

            function clickTile(index, tileBtn) {
                if (!gameActive || tileBtn.disabled) return;
                tileBtn.disabled = true;

                if (activeMines.includes(index)) {
                    tileBtn.innerText = "💣";
                    tileBtn.style.background = "#ef4444";
                    gameActive = false;
                    document.getElementById("startMinesBtn").style.display = "block";
                    document.getElementById("cashoutMinesBtn").style.display = "none";
                    if (window.showCasinoModal) window.showCasinoModal(false, "BOMB EXPLODED!", "0", "💥");
                    else alert("💥 BOMB EXPLODED!");
                } else {
                    tileBtn.innerText = "💎";
                    tileBtn.style.background = "#10b981";
                    gemsRevealed++;
                    currentMulti += 0.35;
                    document.getElementById("minesMulti").innerText = currentMulti.toFixed(2) + "x";
                }
            }

            window.cashoutMines = function() {
                if (!gameActive || gemsRevealed === 0) return alert("Reveal at least 1 tile!");
                gameActive = false;

                const bet = Number(document.getElementById("minesBet").value) || 500;
                const won = Math.floor(bet * currentMulti);
                window.game.balance += won;
                if (window.updateBalance) window.updateBalance();

                if (window.showCasinoModal) window.showCasinoModal(true, `Cashed Out @ ${currentMulti.toFixed(2)}x`, "₹" + won, "💎");
                else alert(`💎 Cashed Out! Won ₹${won}`);

                document.getElementById("startMinesBtn").style.display = "block";
                document.getElementById("cashoutMinesBtn").style.display = "none";
            };
            return;
        }

        // ==========================================
        // 3. DRAGON VS TIGER (CARDS REVEAL)
        // ==========================================
        if (gameId === 'dragon') {
            container.innerHTML = `
                <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:16px; text-align:center;">
                    <div style="display:flex; justify-content:space-around; align-items:center; background:#050811; padding:20px 10px; border-radius:14px; margin-bottom:12px; border:1px solid #1e293b;">
                        <div>
                            <div style="font-size:12px; color:#ef4444; font-weight:800; margin-bottom:6px;">🐉 DRAGON</div>
                            <div id="dragonCard" style="width:60px; height:80px; background:#1e293b; border:2px solid #ef4444; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800;">🎴</div>
                        </div>
                        <div style="font-size:18px; font-weight:800; color:var(--neon-gold);">VS</div>
                        <div>
                            <div style="font-size:12px; color:#3b82f6; font-weight:800; margin-bottom:6px;">🐯 TIGER</div>
                            <div id="tigerCard" style="width:60px; height:80px; background:#1e293b; border:2px solid #3b82f6; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800;">🎴</div>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:12px;">
                        <button onclick="playDragonTiger('DRAGON')" style="padding:12px; background:#ef4444; color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer;">DRAGON (2X)</button>
                        <button onclick="playDragonTiger('TIE')" style="padding:12px; background:#f59e0b; color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer;">TIE (9X)</button>
                        <button onclick="playDragonTiger('TIGER')" style="padding:12px; background:#3b82f6; color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer;">TIGER (2X)</button>
                    </div>

                    <div style="display:flex; gap:6px;">
                        <input type="number" id="dtBet" value="500" style="padding:10px; width:60%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                        <button onclick="document.getElementById('dtBet').value *= 2" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px;">2X</button>
                    </div>
                </div>
            `;

            window.playDragonTiger = function(side) {
                const bet = Number(document.getElementById("dtBet").value) || 500;
                if (window.game.balance < bet) return alert("Low Balance!");

                window.game.balance -= bet;
                if (window.updateBalance) window.updateBalance();

                const dVal = Math.floor(Math.random() * 13) + 1;
                const tVal = Math.floor(Math.random() * 13) + 1;

                document.getElementById("dragonCard").innerText = dVal;
                document.getElementById("tigerCard").innerText = tVal;

                let winner = dVal > tVal ? "DRAGON" : (tVal > dVal ? "TIGER" : "TIE");

                setTimeout(() => {
                    if (side === winner) {
                        const multi = winner === 'TIE' ? 9 : 2;
                        const won = bet * multi;
                        window.game.balance += won;
                        if (window.showCasinoModal) window.showCasinoModal(true, `${winner} WIN!`, "₹" + won, "🐉");
                        else alert(`🎉 ${winner} WIN! Won ₹${won}`);
                    } else {
                        if (window.showCasinoModal) window.showCasinoModal(false, `${winner} Won Round`, "₹" + bet, "💥");
                        else alert(`💥 ${winner} Won Round`);
                    }
                    if (window.updateBalance) window.updateBalance();
                }, 200);
            };
            return;
        }

        // ==========================================
        // 4. NEON 777 SLOTS (3 REELS ANIMATED)
        // ==========================================
        if (gameId === 'slots') {
            const slotSymbols = ["💎", "7️⃣", "🎰", "🔥", "👑", "🍒"];

            container.innerHTML = `
                <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:16px; text-align:center;">
                    <div style="display:flex; justify-content:center; gap:10px; background:#000; padding:20px 10px; border-radius:14px; border:2px solid var(--neon-gold); margin-bottom:12px;">
                        <div id="reel1" style="font-size:42px; background:#1e293b; padding:10px 14px; border-radius:8px;">💎</div>
                        <div id="reel2" style="font-size:42px; background:#1e293b; padding:10px 14px; border-radius:8px;">7️⃣</div>
                        <div id="reel3" style="font-size:42px; background:#1e293b; padding:10px 14px; border-radius:8px;">🎰</div>
                    </div>

                    <div style="display:flex; gap:6px; margin-bottom:12px;">
                        <input type="number" id="slotsBet" value="500" style="padding:10px; width:60%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                        <button onclick="document.getElementById('slotsBet').value *= 2" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px;">2X</button>
                    </div>

                    <button id="spinBtn" onclick="spinSlots()" style="width:100%; padding:14px; background:linear-gradient(135deg, var(--neon-pink), #be185d); color:#fff;
