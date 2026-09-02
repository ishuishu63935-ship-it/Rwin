/* MODULE: PLINKO DROP DELUXE */
(function initPlinkoModule() {
    console.log("🟢 Plinko Drop Engine Loaded!");
    const container = document.getElementById("game-plinko");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:14px; color:var(--neon-green); font-weight:700;">🟢 Plinko Peg Drop</span>
                <span style="font-size:11px; color:var(--neon-gold);">Super VIP Exclusive</span>
            </div>

            <!-- Plinko Canvas & Multipliers Row -->
            <div style="background:#050811; border:1px solid #334155; border-radius:14px; padding:15px; margin:12px 0; position:relative; overflow:hidden;">
                <div id="plinkoDisplayArea" style="height:160px; display:flex; flex-direction:column; justify-content:space-around; align-items:center;">
                    <div style="font-size:20px; letter-spacing:12px;">• • • •</div>
                    <div style="font-size:20px; letter-spacing:10px;">• • • • •</div>
                    <div style="font-size:20px; letter-spacing:8px;">• • • • • •</div>
                    <div id="plinkoBall" style="font-size:24px; position:absolute; top:10px; transition:all 0.3s cubic-bezier(0.25, 1, 0.5, 1);">🟢</div>
                </div>

                <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:4px; margin-top:10px;">
                    <div style="background:#ef4444; color:#fff; font-size:10px; font-weight:800; padding:6px 0; border-radius:6px;">0.2X</div>
                    <div style="background:#f59e0b; color:#000; font-size:10px; font-weight:800; padding:6px 0; border-radius:6px;">1.5X</div>
                    <div style="background:#10b981; color:#000; font-size:10px; font-weight:800; padding:6px 0; border-radius:6px;">5.0X</div>
                    <div style="background:#f59e0b; color:#000; font-size:10px; font-weight:800; padding:6px 0; border-radius:6px;">1.5X</div>
                    <div style="background:#ef4444; color:#fff; font-size:10px; font-weight:800; padding:6px 0; border-radius:6px;">0.2X</div>
                </div>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:14px;">
                <input type="number" id="plinkoBetInput" value="300" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('plinkoBetInput').value = Math.floor(Number(document.getElementById('plinkoBetInput').value)*2)" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px;">2X</button>
                <button onclick="document.getElementById('plinkoBetInput').value = window.game.balance" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px;">MAX</button>
            </div>

            <button id="dropBallBtn" onclick="window.dropPlinkoBall()" style="width:100%; padding:14px; background:var(--neon-green); color:#000; font-weight:800; border-radius:12px; font-size:16px;">🟢 DROP PLINKO BALL</button>
        </div>
    `;

    window.dropPlinkoBall = function() {
        const bet = Number(document.getElementById("plinkoBetInput").value) || 300;
        if (window.game.balance < bet) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        window.game.balance -= bet;
        window.updateBalance();
        window.addXP(45);

        const btn = document.getElementById("dropBallBtn");
        btn.disabled = true;

        const ball = document.getElementById("plinkoBall");
        const outcomes = [
            { multi: 0.2, pos: "10%" },
            { multi: 1.5, pos: "30%" },
            { multi: 5.0, pos: "50%" },
            { multi: 1.5, pos: "70%" },
            { multi: 0.2, pos: "90%" }
        ];

        const target = outcomes[Math.floor(Math.random() * outcomes.length)];
        ball.style.top = "120px";
        ball.style.left = target.pos;

        setTimeout(() => {
            btn.disabled = false;
            ball.style.top = "10px";
            ball.style.left = "48%";

            const won = Math.floor(bet * target.multi);
            if (target.multi >= 1) {
                window.game.balance += won;
                window.showCasinoModal(true, `Plinko ${target.multi}X Slot!`, "₹" + won, "🟢");
            } else {
                window.showCasinoModal(false, `Plinko ${target.multi}X Slot`, "₹" + (bet - won), "🟢");
            }

            window.updateBalance();
            window.saveGame();
        }, 600);
    };
})();
          
