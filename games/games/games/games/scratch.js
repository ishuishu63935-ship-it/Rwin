/* MODULE: CYBER SCRATCH CARD */
(function initScratch() {
    console.log("🎟️ Scratch Card Module Loaded!");
    const container = document.getElementById("game-scratch");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-green);">🎟️ Cyber Gold Scratch Card</h2>
            <p style="font-size:11px; color:#94a3b8;">Scratch & reveal 3 matching symbols!</p>
            <div id="scratchDisplay" style="font-size:36px; margin:15px 0; font-weight:800; color:var(--neon-green);">[❓] [❓] [❓]</div>
            <input type="number" id="scratchBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playScratch()" style="padding:10px 24px; background:var(--neon-green); color:#000; border:none; font-weight:800; border-radius:8px; cursor:pointer;">BUY TICKET (500 Coins)</button>
        </div>
    `;

    window.playScratch = function() {
        const bet = Number(document.getElementById("scratchBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const symbols = ["💰", "💎", "👑", "7️⃣"];
        const s1 = symbols[Math.floor(Math.random() * symbols.length)];
        const s2 = symbols[Math.floor(Math.random() * symbols.length)];
        const s3 = symbols[Math.floor(Math.random() * symbols.length)];

        document.getElementById("scratchDisplay").innerText = `[ ${s1} ] [ ${s2} ] [ ${s3} ]`;

        if (s1 === s2 && s2 === s3) {
            const won = bet * 5;
            game.balance += won;
            addXP(120);
            playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 TRIPLE SCRATCH MATCH! Won ₹${won}`);
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            const won = Math.floor(bet * 1.5);
            game.balance += won;
            addXP(50);
            playSound('win');
            alert(`🎉 DOUBLE MATCH! Won ₹${won}`);
        } else {
            playSound('lose');
        }
        updateBalance();
        saveGame();
    };
})();
