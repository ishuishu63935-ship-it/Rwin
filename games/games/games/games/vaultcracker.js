/* MODULE: VAULT COMBINATION CRACKER (SUPER VIP LEVEL 200) */
(function initVaultCracker() {
    console.log("🔐 Vault Cracker Loaded!");
    const container = document.getElementById("game-vaultcracker");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">🔐 Cyber Vault Combination Cracker</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 200 Required • Guess secret digit (1-5) to unlock 5X vault!</p>
            <div id="vaultDigitDisplay" style="font-size:45px; margin:15px 0; font-weight:800; color:var(--neon-green); background:#000; padding:15px; border-radius:10px;">🔐 [ ? ]</div>
            <input type="number" id="vaultBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <div style="display:flex; justify-content:center; gap:6px;">
                <button onclick="window.crackVault(1)" style="padding:10px; background:#0f172a; border:1px solid var(--neon-green); color:#fff; border-radius:6px; cursor:pointer;">1</button>
                <button onclick="window.crackVault(2)" style="padding:10px; background:#0f172a; border:1px solid var(--neon-green); color:#fff; border-radius:6px; cursor:pointer;">2</button>
                <button onclick="window.crackVault(3)" style="padding:10px; background:#0f172a; border:1px solid var(--neon-green); color:#fff; border-radius:6px; cursor:pointer;">3</button>
                <button onclick="window.crackVault(4)" style="padding:10px; background:#0f172a; border:1px solid var(--neon-green); color:#fff; border-radius:6px; cursor:pointer;">4</button>
                <button onclick="window.crackVault(5)" style="padding:10px; background:#0f172a; border:1px solid var(--neon-green); color:#fff; border-radius:6px; cursor:pointer;">5</button>
            </div>
        </div>
    `;

    window.crackVault = function(digit) {
        const bet = Number(document.getElementById("vaultBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const secret = Math.floor(Math.random() * 5) + 1;
        document.getElementById("vaultDigitDisplay").innerText = `🔓 [ ${secret} ]`;

        if (digit === secret) {
            const won = bet * 5;
            game.balance += won;
            addXP(300);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 VAULT CRACKED! Correct digit ${secret} | Won ₹${won}`);
        } else {
            playSound('lose');
            alert(`❌ ACCESS DENIED! Secret code was ${secret}`);
        }
        updateBalance();
        saveGame();
    };
})();
