/* MASTER UNIVERSAL ENGINE FOR REMAINING 60+ GAMES */
(function initMasterGamesEngine() {
    console.log("🔥 RWIN Master Universal Game Engine Loaded!");

    // Custom UI Templates & Configs for Specific Suite Games
    const gameConfigs = {
        "roulette": { name: "Cyber Roulette 3.0", icon: "🎡", multi: 36, options: ["RED", "BLACK", "GREEN"] },
        "cryptocandle": { name: "BTC Crypto Candle", icon: "📈", multi: 2, options: ["CALL (HIGH)", "PUT (LOW)"] },
        "penalty": { name: "Penalty Shootout", icon: "⚽", multi: 2, options: ["LEFT", "CENTER", "RIGHT"] },
        "chickencross": { name: "Chicken Road Cross", icon: "🐔", multi: 1.8, options: ["CROSS LANE"] },
        "horserace": { name: "Cyber Derby Race", icon: "🐎", multi: 3, options: ["HORSE #1", "HORSE #2", "HORSE #3"] },
        "blackjack": { name: "Cyber Blackjack", icon: "🃏", multi: 2, options: ["HIT CARD", "STAND"] }
    };

    // Auto-populate configurations for generic games (game_16 to game_70)
    for (let i = 16; i <= 70; i++) {
        gameConfigs[`game_${i}`] = {
            name: `VIP Arena Game #${i}`,
            icon: i % 2 === 0 ? "🔥" : "💎",
            multi: (1.5 + (i % 5) * 0.5),
            options: ["OPTION A", "OPTION B", "JACKPOT OPTION"]
        };
    }

    // Dynamic Module Renderer
    window.loadMasterGameView = function(gameId) {
        const container = document.getElementById("game-" + gameId);
        if (!container) return;

        const config = gameConfigs[gameId] || {
            name: `VIP Game ${gameId}`,
            icon: "🎮",
            multi: 2,
            options: ["PLAY ROUND"]
        };

        container.innerHTML = `
            <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
                <!-- Header -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:#050811; padding:10px 14px; border-radius:12px; border:1px solid #1e293b;">
                    <span style="font-size:14px; color:var(--neon-gold); font-weight:800;">${config.icon} ${config.name}</span>
                    <span style="font-size:11px; color:var(--neon-gold); font-weight:600;">🔒 Super VIP Exclusive</span>
                </div>

                <!-- Game Graphic Display Area -->
                <div style="background:#050811; border:2px solid #1e293b; border-radius:14px; padding:25px; margin:15px 0; text-align:center;">
                    <div id="graphic_${gameId}" style="font-size:52px; font-weight:800; color:var(--neon-blue); text-shadow:0 0 15px rgba(0,229,255,0.4);">${config.icon}</div>
                    <div style="font-size:12px; color:#94a3b8; margin-top:8px;">Multiplier Rate: <b style="color:var(--neon-green);">${config.multi}X</b></div>
                </div>

                <!-- Quick Bet Controls -->
                <div style="display:flex; gap:6px; margin-bottom:14px;">
                    <input type="number" id="bet_${gameId}" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                    <button onclick="document.getElementById('bet_${gameId}').value = Math.floor(Number(document.getElementById('bet_${gameId}').value)*2); if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                    <button onclick="document.getElementById('bet_${gameId}').value = window.game.balance; if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
                </div>

                <!-- Dynamic Action Buttons -->
                <div style="display:grid; grid-template-columns:repeat(${Math.min(config.options.length, 3)}, 1fr); gap:8px;">
                    ${config.options.map(opt => `
                        <button onclick="window.playMasterGameRound('${gameId}', '${opt}', ${config.multi})" style="padding:12px 6px; background:linear-gradient(135deg, var(--neon-blue), #0284c7); color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer; font-size:12px;">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;
    };

    // Execution Logic
    window.playMasterGameRound = function(gameId, optionChosen, multiplier) {
        const betInput = document.getElementById(`bet_${gameId}`);
        const bet = Number(betInput ? betInput.value : 500) || 500;

        if (window.game.balance < bet) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        if (window.CasinoAudio) window.CasinoAudio.playChip();

        window.game.balance -= bet;
        window.updateBalance();
        window.addXP(65);

        const isWin = Math.random() < 0.48; // 48% Win Chance

        setTimeout(() => {
            if (isWin) {
                const wonAmt = Math.floor(bet * multiplier);
                window.game.balance += wonAmt;
                if (window.CasinoAudio) window.CasinoAudio.playWin();
                window.showCasinoModal(true, `${optionChosen} Success (${multiplier}X)!`, "₹" + wonAmt, "🎉");
            } else {
                if (window.CasinoAudio) window.CasinoAudio.playTick();
                window.showCasinoModal(false, `${optionChosen} Lost`, "₹" + bet, "💥");
            }

            window.updateBalance();
            window.saveGame();
        }, 250);
    };

    // Auto-hook into openGame function
    const originalOpenGame = window.openGame;
    window.openGame = function(gameId, title) {
        if (originalOpenGame) originalOpenGame(gameId, title);

        // Check if dynamic container needs loading
        let targetScreen = document.getElementById('game-' + gameId);
        if (!targetScreen) {
            targetScreen = document.createElement('div');
            targetScreen.id = 'game-' + gameId;
            targetScreen.className = 'game-screen active';
            document.querySelector('.gameContainer').appendChild(targetScreen);
        }

        window.loadMasterGameView(gameId);
    };
})();
      
