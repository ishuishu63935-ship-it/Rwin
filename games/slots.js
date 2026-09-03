/* MODULE: CYBER SLOTS 3.0 (DELUXE ANIMATED REELS & AUDIO ENGINE) */
(function initSlotsModule() {
    console.log("🎰 Cyber Slots 3.0 Deluxe Engine Loaded!");
    const container = document.getElementById("game-slots");
    if (!container) return;

    const slotSymbols = ["💎", "7️⃣", "🎰", "🔥", "👑", "🍒"];

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <!-- Header Bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:#050811; padding:10px 14px; border-radius:12px; border:1px solid #1e293b;">
                <span style="font-size:14px; color:var(--neon-gold); font-weight:800;">🎰 3-Reel Cyber Jackpot Slots</span>
                <span style="font-size:11px; color:#94a3b8; font-weight:600;">LVL 5 Required</span>
            </div>

            <!-- Reels Display Container -->
            <div style="display:flex; justify-content:center; gap:12px; background:#000; padding:22px 12px; border-radius:16px; border:2px solid var(--neon-gold); margin:15px 0; box-shadow:0 0 25px rgba(245,158,11,0.25);">
                <div id="slotReel1" style="background:#1f293d; font-size:48px; padding:12px 18px; border-radius:12px; border:1px solid #334155; min-width:70px; text-shadow:0 0 10px rgba(255,255,255,0.3);">💎</div>
                <div id="slotReel2" style="background:#1f293d; font-size:48px; padding:12px 18px; border-radius:12px; border:1px solid #334155; min-width:70px; text-shadow:0 0 10px rgba(255,255,255,0.3);">7️⃣</div>
                <div id="slotReel3" style="background:#1f293d; font-size:48px; padding:12px 18px; border-radius:12px; border:1px solid #334155; min-width:70px; text-shadow:0 0 10px rgba(255,255,255,0.3);">🎰</div>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:14px;">
                <input type="number" id="slotsBetInput" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('slotsBetInput').value = Math.floor(Number(document.getElementById('slotsBetInput').value)*2); if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px; cursor:pointer;">2X</button>
                <button onclick="document.getElementById('slotsBetInput').value = window.game.balance; if(window.CasinoAudio) window.CasinoAudio.playChip();" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px; cursor:pointer;">MAX</button>
            </div>

            <button id="spinSlotsBtn" onclick="window.spinDeluxeSlots()" style="width:100%; padding:14px; background:linear-gradient(135deg, var(--neon-pink), #be185d); color:#fff; font-weight:800; border-radius:12px; font-size:16px; border:none; cursor:pointer; box-shadow:0 0 15px rgba(236,72,153,0.4);">🎰 SPIN REELS</button>
        </div>
    `;

    window.spinDeluxeSlots = function() {
        const bet = Number(document.getElementById("slotsBetInput").value) || 500;
        if (window.game.balance < bet) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        if (window.CasinoAudio) window.CasinoAudio.playChip();

        window.game.balance -= bet;
        window.updateBalance();
        window.addXP(75);

        const btn = document.getElementById("spinSlotsBtn");
        btn.disabled = true;
        btn.style.opacity = "0.5";

        let spinCount = 0;
        const spinInterval = setInterval(() => {
            document.getElementById("slotReel1").innerText = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
            document.getElementById("slotReel2").innerText = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
            document.getElementById("slotReel3").innerText = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
            
            if (window.CasinoAudio) window.CasinoAudio.playTick();
            spinCount++;

            if (spinCount > 15) {
                clearInterval(spinInterval);
                btn.disabled = false;
                btn.style.opacity = "1";

                const res1 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                const res2 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
                const res3 = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];

                document.getElementById("slotReel1").innerText = res1;
                document.getElementById("slotReel2").innerText = res2;
                document.getElementById("slotReel3").innerText = res3;

                if (res1 === res2 && res2 === res3) {
                    const won = bet * 10;
                    window.game.balance += won;
                    if (window.CasinoAudio) window.CasinoAudio.playWin();
                    window.showCasinoModal(true, "TRIPLE JACKPOT (10X)!", "₹" + won, "🎰");
                } else if (res1 === res2 || res2 === res3 || res1 === res3) {
                    const won = bet * 2;
                    window.game.balance += won;
                    if (window.CasinoAudio) window.CasinoAudio.playWin();
                    window.showCasinoModal(true, "DOUBLE MATCH (2X)!", "₹" + won, "🎰");
                } else {
                    window.showCasinoModal(false, "No Match", "₹" + bet, "🎰");
                }

                window.updateBalance();
                window.saveGame();
            }
        }, 80);
    };
})();
