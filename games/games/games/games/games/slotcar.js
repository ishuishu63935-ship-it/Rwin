/* MODULE: CYBER DRAG RACE (SUPER VIP LEVEL 130) */
(function initSlotCar() {
    console.log("🏎️ Drag Race Loaded!");
    const container = document.getElementById("game-slotcar");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">🏎️ Cyber Drag Race</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 130 Required • Pick Green Nitro (2X) or Red Hyper (2X)!</p>
            <div id="dragTrack" style="font-size:28px; margin:15px 0; font-weight:800; color:var(--neon-green); background:#022c22; padding:15px; border-radius:10px;">
                🏎️ GREEN NITRO vs 🏎️ RED HYPER
            </div>
            <input type="number" id="dragBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.raceDragCar('GREEN')" style="padding:10px 18px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">🏎️ GREEN NITRO (2X)</button>
            <button onclick="window.raceDragCar('RED')" style="padding:10px 18px; background:#ef4444; color:#fff; border:none; font-weight:800; border-radius:8px; margin:4px; cursor:pointer;">🏎️ RED HYPER (2X)</button>
        </div>
    `;

    window.raceDragCar = function(choice) {
        const bet = Number(document.getElementById("dragBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const track = document.getElementById("dragTrack");
        track.innerText = "🚦 3... 2... 1... GO! 💨";

        setTimeout(() => {
            const winner = Math.random() < 0.5 ? "GREEN" : "RED";
            track.innerText = `🏁 WINNER: ${winner === "GREEN" ? "🟢 GREEN NITRO" : "🔴 RED HYPER"}!`;

            if (choice === winner) {
                const won = bet * 2;
                game.balance += won;
                addXP(180);
                playSound('win');
                if (typeof confetti === 'function') confetti();
                alert(`🎉 DRAG RACE WIN! ${winner} Car Won | Earned ₹${won}`);
            } else {
                playSound('lose');
                alert(`❌ RACE LOST! Winner was ${winner}`);
            }
            updateBalance();
            saveGame();
        }, 1200);
    };
})();
