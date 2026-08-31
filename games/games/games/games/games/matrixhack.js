/* MODULE: MATRIX TERMINAL HACKER (SUPER VIP LEVEL 155) */
(function initMatrixHack() {
    console.log("💻 Matrix Hacker Loaded!");
    const container = document.getElementById("game-matrixhack");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">💻 Cyber Matrix Terminal Hacker</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 155 Required • Hack 1 of 4 Nodes! Avoid Firewall!</p>
            <div id="matrixDisplay" style="font-size:36px; margin:15px 0; background:#000; padding:15px; border-radius:10px; border:1px solid var(--neon-green);">💻 💻 💻 💻</div>
            <input type="number" id="matrixBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.hackNode(1)" style="padding:10px 14px; background:#022c22; color:var(--neon-green); border:1px solid var(--neon-green); font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">NODE 1</button>
            <button onclick="window.hackNode(2)" style="padding:10px 14px; background:#022c22; color:var(--neon-green); border:1px solid var(--neon-green); font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">NODE 2</button>
            <button onclick="window.hackNode(3)" style="padding:10px 14px; background:#022c22; color:var(--neon-green); border:1px solid var(--neon-green); font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">NODE 3</button>
            <button onclick="window.hackNode(4)" style="padding:10px 14px; background:#022c22; color:var(--neon-green); border:1px solid var(--neon-green); font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">NODE 4</button>
        </div>
    `;

    window.hackNode = function(pick) {
        const bet = Number(document.getElementById("matrixBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const firewallPos = Math.floor(Math.random() * 4) + 1;
        let nodes = ["💾 DATA", "💾 DATA", "💾 DATA", "💾 DATA"];
        nodes[firewallPos - 1] = "💥 FIREWALL";

        document.getElementById("matrixDisplay").innerText = nodes.join(" | ");

        if (pick !== firewallPos) {
            const won = Math.floor(bet * 2.2);
            game.balance += won;
            addXP(200);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 NODE HACKED SUCCESSFULLY! Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ FIREWALL TRIGGERED AT NODE #${firewallPos}! Hack Failed.`);
        }
        updateBalance();
        saveGame();
    };
})();
