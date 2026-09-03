/* RWIN 3.0 MASTER ALL-IN-ONE CASINO GAME ENGINE */
(function initMasterCasinoEngine() {
    console.log("🎮 RWIN Universal Master Game Engine Ready!");

    let activeTimers = {};

    window.loadMasterGameView = function(gameId) {
        const container = document.getElementById("game-" + gameId);
        if (!container) return;

        // Clear existing intervals for clean re-open
        if (activeTimers[gameId]) clearInterval(activeTimers[gameId]);

        // 1. COLOR PREDICTION (WINGO 30S)
        if (gameId === 'color') {
            let timer = 30;
            let history = [
                { period: "20260903080", num: 7, color: "GREEN", size: "BIG" },
                { period: "20260903079", num: 2, color: "RED", size: "SMALL" },
                { period: "20260903078", num: 0, color: "VIOLET", size: "SMALL" }
            ];

            container.innerHTML = `
                <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
                    <div style="display:flex; justify-content:space-between; align-items:center; background:#050811; padding:10px 14px; border-radius:12px; border:1px solid #1e293b; margin-bottom:14px;">
                        <div style="text-align:left;">
                            <div style="font-size:10px; color:#94a3b8;">PERIOD ID</div>
                            <div id="wingoPeriod" style="font-size:13px; font-weight:800; color:var(--neon-blue);">20260903081</div>
                        </div>
                        <div style="text-align:right;">
                            <div style="font-size:10px; color:#94a3b8;">COUNTDOWN</div>
                            <div id="wingoTimer" style="font-size:22px; font-weight:800; color:var(--neon-green);">00:30</div>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:12px;">
                        <button onclick="window.playColorRound('GREEN')" style="padding:12px; background:var(--neon-green); color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer;">GREEN (2X)</button>
                        <button onclick="window.playColorRound('VIOLET')" style="padding:12px; background:#8b5cf6; color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer;">VIOLET (4.5X)</button>
                        <button onclick="window.playColorRound('RED')" style="padding:12px; background:#ef4444; color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer;">RED (2X)</button>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px;">
                        <button onclick="window.playColorRound('BIG')" style="padding:10px; background:#f59e0b; color:#000; font-weight:800; border-radius:8px; border:none; cursor:pointer;">BIG (2X)</button>
                        <button onclick="window.playColorRound('SMALL')" style="padding:10px; background:#3b82f6; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">SMALL (2X)</button>
                    </div>

                    <div style="display:flex; gap:6px; margin-bottom:12px;">
                        <input type="number" id="colorBet" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                        <button onclick="document.getElementById('colorBet').value *= 2" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                        <button onclick="document.getElementById('colorBet').value = window.game ? window.game.balance : 10000" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
                    </div>

                    <div style="background:#050811; border:1px solid #1e293b; border-radius:12px; padding:10px; text-align:left;">
                        <div style="font-size:11px; font-weight:800; color:var(--neon-gold); margin-bottom:6px;">📊 TREND HISTORY</div>
                        <div id="colorHistoryBox" style="font-size:11px; color:#cbd5e1;"></div>
                    </div>
                </div>
            `;

            function renderHistory() {
                const box = document.getElementById("colorHistoryBox");
                if (!box) return;
                box.innerHTML = history.map(h => `<div style="display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px dashed #1e293b;"><span>${h.period}</span><b>${h.num} (${h.color})</b></div>`).join('');
            }
            renderHistory();

            activeTimers['color'] = setInterval(() => {
                timer--;
                const tEl = document.getElementById("wingoTimer");
                if (tEl) tEl.innerText = `00:${timer.toString().padStart(2, '0')}`;
                if (timer <= 0) { timer = 30; }
            }, 1000);

            window.playColorRound = function(choice) {
                const bet = Number(document.getElementById("colorBet").value) || 500;
                if (window.game && window.game.balance < bet) return window.showCasinoModal(false, "Low Balance", "0", "⚠️");
                
                if (window.CasinoAudio) window.CasinoAudio.playChip();
                window.game.balance -= bet;
                window.updateBalance();

                const nums = [0,1,2,3,4,5,6,7,8,9];
                const resNum = nums[Math.floor(Math.random()*nums.length)];
                const resColor = (resNum === 0 || resNum === 5) ? "VIOLET" : (resNum % 2 === 0 ? "RED" : "GREEN");
                const resSize = resNum >= 5 ? "BIG" : "SMALL";

                history.unshift({ period: Date.now().toString().slice(-8), num: resNum, color: resColor, size: resSize });
                renderHistory();

                if (choice === resColor || choice === resSize) {
                    const won = bet * 2;
                    window.game.balance += won;
                    if (window.CasinoAudio) window.CasinoAudio.playWin();
                    window.showCasinoModal(true, `WIN! (${resColor} ${resNum})`, "₹" + won, "🎨");
                } else {
                    if (window.CasinoAudio) window.CasinoAudio.playTick();
                    window.showCasinoModal(false, `Result: ${resColor} ${resNum}`, "₹" + bet, "💥");
                }
                window.updateBalance();
                window.saveGame();
            };
            return;
        }

        // 2. AVIATOR CRASH
        if (gameId === 'aviator') {
            let isFlying = false;
            let multi = 1.00;

            container.innerHTML = `
                <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
                    <div style="background:#050811; border:2px solid #1e293b; border-radius:14px; height:180px; position:relative; overflow:hidden; margin-bottom:15px;">
                        <div id="aviatorMulti" style="position:absolute; top:35%; width:100%; text-align:center; font-size:42px; font-weight:800; color:var(--neon-green);">1.00x</div>
                        <div id="aviatorPlane" style="position:absolute; bottom:15px; left:15px; font-size:36px; transition:all 0.1s linear;">🚀</div>
                    </div>

                    <div style="display:flex; gap:6px; margin-bottom:12px;">
                        <input type="number" id="aviatorBet" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                        <button onclick="document.getElementById('aviatorBet').value *= 2" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                        <button onclick="document.getElementById('aviatorBet').value = window.game ? window.game.balance : 10000" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
                    </div>

                    <button id="startJetBtn" onclick="window.startJetFlight()" style="width:100%; padding:14px; background:linear-gradient(135deg, var(--neon-green), #059669); color:#000; font-weight:800; border-radius:12px; font-size:16px; border:none; cursor:pointer;">🚀 LAUNCH JET</button>
                    <button id="cashoutJetBtn" onclick="window.cashoutJetFlight()" style="width:100%; padding:14px; background:linear-gradient(135deg, var(--neon-gold), #d97706); color:#000; font-weight:800; border-radius:12px; font-size:16px; border:none; cursor:pointer; display:none;">💰 CASHOUT NOW</button>
                </div>
            `;

            window.startJetFlight = function() {
                const bet = Number(document.getElementById("aviatorBet").value) || 500;
                if (window.game && window.game.balance < bet) return window.showCasinoModal(false, "Low Balance", "0", "⚠️");

                if (window.CasinoAudio) window.CasinoAudio.playChip();
                window.game.balance -= bet;
                window.updateBalance();

                isFlying = true;
                multi = 1.00;
                document.getElementById("startJetBtn").style.display = "none";
                document.getElementById("cashoutJetBtn").style.display = "block";

                const crashPoint = (Math.random() * 3.5 + 1.1).toFixed(2);
                const plane = document.getElementById("aviatorPlane");

                activeTimers['aviator'] = setInterval(() => {
                    multi += 0.05;
                    const mEl = document.getElementById("aviatorMulti");
                    if (mEl) mEl.innerText = multi.toFixed(2) + "x";

                    if (plane) {
                        plane.style.left = Math.min(80, (multi - 1) * 25 + 10) + "%";
                        plane.style.bottom = Math.min(70, (multi - 1) * 20 + 15) + "%";
                    }

                    if (multi >= crashPoint) {
                        clearInterval(activeTimers['aviator']);
                        isFlying = false;
                        if (mEl) { mEl.innerText = "💥 FLEW AWAY!"; mEl.style.color = "#ef4444"; }
                        window.showCasinoModal(false, "Jet Crashed!", "₹" + bet, "🚀");
                        document.getElementById("startJetBtn").style.display = "block";
                        document.getElementById("cashoutJetBtn").style.display = "none";
                        if (plane) { plane.style.left = "15px"; plane.style.bottom = "15px"; }
                    }
                }, 90);
            };

            window.cashoutJetFlight = function() {
                if (!isFlying) return;
                clearInterval(activeTimers['aviator']);
                isFlying = false;

                const bet = Number(document.getElementById("aviatorBet").value) || 500;
                const won = Math.floor(bet * multi);
                window.game.balance += won;
                window.updateBalance();
                window.saveGame();

                if (window.CasinoAudio) window.CasinoAudio.playWin();
                window.showCasinoModal(true, `Cashed Out @ ${multi.toFixed(2)}x!`, "₹" + won, "✈️");

                document.getElementById("startJetBtn").style.display = "block";
                document.getElementById("cashoutJetBtn").style.display = "none";
            };
            return;
        }

        // 3. UNIVERSAL ARENA ENGINE FOR ALL OTHER 68 GAMES
        const gameTitles = {
            "mines": "Cyber Minesweeper 5x5",
            "dragon": "Dragon vs Tiger Live",
            "hilo": "Hi-Lo Poker Streak",
            "slots": "Neon 777 Jackpot Slots",
            "dice2": "Cyber Dice Roll 3.0",
            "roulette": "European Roulette Pro",
            "plinko": "Plinko Drop Multiplier",
            "baccarat": "Speed Baccarat VIP"
        };

        const title = gameTitles[gameId] || `VIP Arena Game (${gameId.toUpperCase()})`;

        container.innerHTML = `
            <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
                <div style="background:#050811; border:2px solid #1e293b; border-radius:14px; padding:25px; margin-bottom:15px;">
                    <div style="font-size:48px; margin-bottom:6px;">🎰</div>
                    <div style="font-size:16px; font-weight:800; color:var(--neon-blue);">${title}</div>
                    <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Multiplier Payout: <b style="color:var(--neon-green);">2.50X</b></div>
                </div>

                <div style="display:flex; gap:6px; margin-bottom:14px;">
                    <input type="number" id="genBet_${gameId}" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                    <button onclick="document.getElementById('genBet_${gameId}').value *= 2" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                    <button onclick="document.getElementById('genBet_${gameId}').value = window.game ? window.game.balance : 10000" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <button onclick="window.playGenericRound('${gameId}', 'OPTION A', 2.5)" style="padding:14px; background:linear-gradient(135deg, var(--neon-blue), #0284c7); color:#000; font-weight:800; border-radius:12px; border:none; cursor:pointer;">PLAY OPTION A</button>
                    <button onclick="window.playGenericRound('${gameId}', 'OPTION B', 2.5)" style="padding:14px; background:linear-gradient(135deg, var(--neon-gold), #d97706); color:#000; font-weight:800; border-radius:12px; border:none; cursor:pointer;">PLAY OPTION B</button>
                </div>
            </div>
        `;

        window.playGenericRound = function(gId, opt, multi) {
            const betInput = document.getElementById(`genBet_${gId}`);
            const bet = Number(betInput ? betInput.value : 500) || 500;

            if (window.game && window.game.balance < bet) return window.showCasinoModal(false, "Low Balance", "0", "⚠️");

            if (window.CasinoAudio) window.CasinoAudio.playChip();
            window.game.balance -= bet;
            window.updateBalance();

            const isWin = Math.random() < 0.50;

            setTimeout(() => {
                if (isWin) {
                    const won = Math.floor(bet * multi);
                    window.game.balance += won;
                    if (window.CasinoAudio) window.CasinoAudio.playWin();
                    window.showCasinoModal(true, `${opt} WIN (${multi}X)!`, "₹" + won, "🎉");
                } else {
                    if (window.CasinoAudio) window.CasinoAudio.playTick();
                    window.showCasinoModal(false, `${opt} Lost`, "₹" + bet, "💥");
                }
                window.updateBalance();
                window.saveGame();
            }, 200);
        };
    };
})();
                
