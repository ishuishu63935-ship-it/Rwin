/* MODULE: MOON ROCKET CRASH (SUPER VIP LEVEL 12) */
(function initCrash3() {
    console.log("🚀 Moon Rocket Loaded!");
    const container = document.getElementById("game-crash3");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">🌕 Moon Rocket Dash</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 12 Required • Cashout before crash!</p>
            <div id="c3Multi" style="font-size:45px; margin:15px 0; font-weight:800; color:var(--neon-pink);">1.00x</div>
            <input type="number" id="c3Bet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button id="startC3Btn" onclick="window.startC3()" style="padding:10px 24px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; cursor:pointer;">LAUNCH MOON ROCKET</button>
            <button id="cashC3Btn" onclick="window.cashC3()" style="padding:10px 24px; background:var(--neon-gold); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer; display:none;">💰 CASHOUT</button>
        </div>
    `;

    let timer, multi = 1.00, active = false, betAmt = 0;
    window.startC3 = function() {
        betAmt = Number(document.getElementById("c3Bet").value) || 500;
        if (game.balance < betAmt) return alert("Low Balance!");
        game.balance -= betAmt; updateBalance(); addXP(80);
        active = true; multi = 1.00;
        document.getElementById("startC3Btn").style.display = "none";
        document.getElementById("cashC3Btn").style.display = "inline-block";

        const crashAt = (Math.random() * 5 + 1.1).toFixed(2);
        timer = setInterval(() => {
            multi += 0.08;
            document.getElementById("c3Multi").innerText = multi.toFixed(2) + "x";
            if (multi >= crashAt) {
                clearInterval(timer); active = false;
                document.getElementById("c3Multi").innerText = "💥 CRASHED!";
                playSound('lose');
                document.getElementById("startC3Btn").style.display = "inline-block";
                document.getElementById("cashC3Btn").style.display = "none";
            }
        }, 100);
    };

    window.cashC3 = function() {
        if (!active) return;
        clearInterval(timer); active = false;
        const won = Math.floor(betAmt * multi);
        game.balance += won; addXP(130); updateBalance(); saveGame(); playSound('win');
        if (typeof confetti === 'function') confetti();
        alert(`🎉 MOON CASHOUT AT ${multi.toFixed(2)}x! Won ₹${won}`);
        document.getElementById("startC3Btn").style.display = "inline-block";
        document.getElementById("cashC3Btn").style.display = "none";
    };
})();
