/* MODULE: CYBER DERBY HORSE RACE (SUPER VIP LEVEL 90) */
(function initHorseRace() {
    console.log("🐎 Cyber Derby Loaded!");
    const container = document.getElementById("game-horserace");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-gold);">🐎 Cyber Derby Horse Race</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 90 Required • Pick your Cyber Stallion for 3X Payout!</p>
            <div id="horseTrack" style="font-size:28px; margin:15px 0; font-weight:800; color:var(--neon-gold); background:#022c22; padding:15px; border-radius:10px; border:1px solid #10b981;">
                🐎 #1 Neon Blaze | 🐎 #2 Cyber Flash | 🐎 #3 Gold Runner
            </div>
            <input type="number" id="horseBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.raceHorse(1)" style="padding:10px 14px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">#1 NEON BLAZE (3X)</button>
            <button onclick="window.raceHorse(2)" style="padding:10px 14px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">#2 CYBER FLASH (3X)</button>
            <button onclick="window.raceHorse(3)" style="padding:10px 14px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">#3 GOLD RUNNER (3X)</button>
        </div>
    `;

    window.raceHorse = function(pick) {
        const bet = Number(document.getElementById("horseBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const track = document.getElementById("horseTrack");
        track.innerText = "🏁 RACE STARTED... 🐎💨";

        setTimeout(() => {
            const winner = Math.floor(Math.random() * 3) + 1;
            const names = ["", "#1 Neon Blaze", "#2 Cyber Flash", "#3 Gold Runner"];
            track.innerText = `🏆 WINNER: ${names[winner]}!`;

            if (pick === winner) {
                const won = bet * 3;
                game.balance += won;
                addXP(200);
                playSound('win');
                if (typeof confetti === 'function') confetti();
                alert(`🎉 DERBY WIN! Horse ${names[winner]} Won! | Earned ₹${won}`);
            } else {
                playSound('lose');
                alert(`❌ RACE LOST! Winner was ${names[winner]}`);
            }
            updateBalance();
            saveGame();
        }, 1200);
    };
})();
