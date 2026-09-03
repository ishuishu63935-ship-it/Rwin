/* MODULE: HI-LO STREAK 3.0 (DELUXE CARD ENGINE) */
(function initHiLoModule() {
    console.log("🃏 Hi-Lo Streak 3.0 Engine Loaded!");
    const container = document.getElementById("game-hilo");
    if (!container) return;

    const cards = [
        { rank: "2", val: 2 }, { rank: "3", val: 3 }, { rank: "4", val: 4 },
        { rank: "5", val: 5 }, { rank: "6", val: 6 }, { rank: "7", val: 7 },
        { rank: "8", val: 8 }, { rank: "9", val: 9 }, { rank: "10", val: 10 },
        { rank: "J", val: 11 }, { rank: "Q", val: 12 }, { rank: "K", val: 13 }, { rank: "A", val: 14 }
    ];

    let currentCard = cards[Math.floor(Math.random() * cards.length)];
    let streak = 0;
    let hiloBetAmt = 0;
    let inProgress = false;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <!-- Header Bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:#050811; padding:10px 14px; border-radius:12px; border:1px solid #1e293b;">
                <span style="font-size:14px; color:var(--neon-blue); font-weight:800;">🃏 Hi-Lo Streak</span>
                <span style="font-size:11px; color:#94a3b8; font-weight:600;">LVL 3 Required</span>
            </div>

            <!-- Card & Multiplier Display -->
            <div style="background:#050811; border:2px solid #1e293b; border-radius:14px; padding:20px; margin:12px 0;">
                <div style="font-size:11px; color:#94a3b8; margin-bottom:4px;">CURRENT CARD</div>
                <div id="hiloCardDisplay" style="font-size:64px; font-weight:800; color:var(--neon-blue); text-shadow:0 0 15px rgba(0,229,255,0.4);">${currentCard.rank}</div>
                <div id="hiloStreakText" style="font-size:13px; color:var(--neon-gold); font-weight:700; margin-top:8px;">Streak: 0 | Multiplier: 1.00X</div>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:14px;">
                <input type="number" id="hiloBetInput" value="300" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('hiloBetInput').value = Math.floor(Number(document.getElementById('hiloBetInput').value)*2); if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                <button onclick="document.getElementById('hiloBetInput').value = window.game.balance; if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
            </div>

            <!-- Action Controls -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                <button onclick="window.guessHiLo('HIGHER')" style="padding:14px; background:linear-gradient(135deg, var(--neon-green), #059669); color:#000; font-weight:800; border-radius:12px; border:none; cursor:pointer;">⬆️ HIGHER</button>
                <button onclick="window.guessHiLo('LOWER')" style="padding:14px; background:linear-gradient(135deg, #ef4444, #b91c1c); color:#fff; font-weight:800; border-radius:12px; border:none; cursor:pointer;">⬇️ LOWER</button>
            </div>

            <button id="cashoutHiloBtn" onclick="window.cashoutHiLo()" style="width:100%; padding:12px; background:linear-gradient(135deg, var(--neon-gold), #d97706); color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer; display:none;">💰 CASHOUT (₹0)</button>
        </div>
    `;

    window.guessHiLo = function(guess) {
        if (!inProgress) {
            hiloBetAmt = Number(document.getElementById("hiloBetInput").value) || 300;
            if (window.game.balance < hiloBetAmt) {
                window.showCasinoModal(false, "Low Balance", "0", "⚠️");
                return;
            }
            window.game.balance -= hiloBetAmt;
            window.updateBalance();
            inProgress = true;
            streak = 0;
        }

        if (window.CasinoAudio) window.CasinoAudio.playChip();

        const nextCard = cards[Math.floor(Math.random() * cards.length)];
        const display = document.getElementById("hiloCardDisplay");
        display.innerText = nextCard.rank;

        let isCorrect = false;
        if (guess === 'HIGHER' && nextCard.val >= currentCard.val) isCorrect = true;
        if (guess === 'LOWER' && nextCard.val <= currentCard.val) isCorrect = true;

        currentCard = nextCard;

        if (isCorrect) {
            streak++;
            const multi = (1 + (streak * 0.5)).toFixed(2);
            const currentWin = Math.floor(hiloBetAmt * multi);

            document.getElementById("hiloStreakText").innerText = `Streak: ${streak} | Multiplier: ${multi}X`;
            
            const coBtn = document.getElementById("cashoutHiloBtn");
            coBtn.style.display = "block";
            coBtn.innerText = `💰 CASHOUT (₹${currentWin})`;
        } else {
            inProgress = false;
            streak = 0;
            document.getElementById("hiloStreakText").innerText = "Streak: 0 | Multiplier: 1.00X";
            document.getElementById("cashoutHiloBtn").style.display = "none";

            if (window.CasinoAudio) window.CasinoAudio.playTick();
            window.showCasinoModal(false, "Wrong Guess!", "₹" + hiloBetAmt, "🃏");
        }
    };

    window.cashoutHiLo = function() {
        if (!inProgress || streak === 0) return;

        const multi = (1 + (streak * 0.5));
        const won = Math.floor(hiloBetAmt * multi);

        window.game.balance += won;
        window.addXP(70);
        window.updateBalance();
        window.saveGame();

        inProgress = false;
        streak = 0;

        document.getElementById("hiloStreakText").innerText = "Streak: 0 | Multiplier: 1.00X";
        document.getElementById("cashoutHiloBtn").style.display = "none";

        if (window.CasinoAudio) window.CasinoAudio.playWin();
        window.showCasinoModal(true, `Cashed Out (${multi.toFixed(2)}X)!`, "₹" + won, "🃏");
    };
})();
    
