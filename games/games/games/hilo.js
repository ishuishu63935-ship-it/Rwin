/* MODULE: 3D CARD FLIP HI-LO STREAK */
(function initHiLoModule() {
    console.log("🃏 3D Hi-Lo Streak Engine Loaded!");
    const container = document.getElementById("game-hilo");
    if(!container) return;

    let streakCount = 0;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="font-size:12px; color:var(--neon-gold); font-weight:700;" id="hiloStreakBadge">🔥 Streak: 0X</span>
                <span style="font-size:11px; color:#94a3b8;">Level 3 Unlocked</span>
            </div>

            <!-- 3D Card Display -->
            <div id="card3D" style="perspective: 1000px; margin:15px 0;">
                <div id="cardInner" style="width:110px; height:150px; margin:auto; background:linear-gradient(135deg, #1e293b, #0f172a); border:2px solid var(--neon-blue); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:55px; font-weight:800; color:#fff; box-shadow:0 0 20px rgba(0,229,255,0.2); transition:transform 0.4s ease;">
                    <span id="currentCardNum">7</span>
                </div>
            </div>

            <!-- Bet Control Buttons -->
            <div style="display:flex; justify-content:center; gap:6px; margin-bottom:12px;">
                <input type="number" id="hiloBet" value="200" style="padding:8px; width:45%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('hiloBet').value = Math.floor(Number(document.getElementById('hiloBet').value)*2)" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px;">2X</button>
                <button onclick="document.getElementById('hiloBet').value = window.game.balance" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px;">MAX</button>
            </div>

            <!-- Higher / Lower Action Buttons -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <button onclick="window.playHiLo3D('HIGHER')" style="padding:14px; background:var(--neon-green); color:#000; font-weight:800; border-radius:12px; font-size:15px;">⬆️ HIGHER (2X)</button>
                <button onclick="window.playHiLo3D('LOWER')" style="padding:14px; background:var(--neon-red); color:#fff; font-weight:800; border-radius:12px; font-size:15px;">⬇️ LOWER (2X)</button>
            </div>
        </div>
    `;

    window.playHiLo3D = function(choice) {
        const bet = Number(document.getElementById("hiloBet").value) || 200;
        if (window.game.balance < bet) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        window.game.balance -= bet;
        window.updateBalance();

        const cardInner = document.getElementById("cardInner");
        cardInner.style.transform = "rotateY(180deg)";

        setTimeout(() => {
            const nextCard = Math.floor(Math.random() * 12) + 1;
            document.getElementById("currentCardNum").innerText = nextCard;
            cardInner.style.transform = "rotateY(0deg)";

            let win = false;
            if (choice === 'HIGHER' && nextCard >= window.game.currentCard) win = true;
            if (choice === 'LOWER' && nextCard <= window.game.currentCard) win = true;

            if (win) {
                streakCount++;
                const won = Math.floor(bet * (1.95 + (streakCount * 0.1)));
                window.game.balance += won;
                window.addXP(70);
                document.getElementById("hiloStreakBadge").innerText = `🔥 Streak: ${streakCount}X`;
                window.showCasinoModal(true, `Streak Win (${streakCount}X)!`, "₹" + won, "🃏");
            } else {
                streakCount = 0;
                document.getElementById("hiloStreakBadge").innerText = `🔥 Streak: 0X`;
                window.showCasinoModal(false, "Streak Broken", "₹" + bet, "🃏");
            }

            window.game.currentCard = nextCard;
            window.updateBalance();
            window.saveGame();
        }, 200);
    };
})();
