/* MODULE: LUCKY CARD FLIP (SUPER VIP LEVEL 18) */
(function initCardFlip() {
    console.log("🎴 Lucky Card Flip Loaded!");
    const container = document.getElementById("game-cardflip");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-blue);">🎴 Lucky 3-Card Flip</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 18 Required • Pick 1 of 3 Hidden Cards!</p>
            <div id="cfDisplay" style="font-size:45px; margin:15px 0;">🎴 🎴 🎴</div>
            <input type="number" id="cfBet" value="500" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.playCardFlip(1)" style="padding:10px 14px; background:var(--neon-blue); color:#000; font-weight:800; border-radius:8px; margin:3px; border:none; cursor:pointer;">CARD 1</button>
            <button onclick="window.playCardFlip(2)" style="padding:10px 14px; background:var(--neon-blue); color:#000; font-weight:800; border-radius:8px; margin:3px; border:none; cursor:pointer;">CARD 2</button>
            <button onclick="window.playCardFlip(3)" style="padding:10px 14px; background:var(--neon-blue); color:#000; font-weight:800; border-radius:8px; margin:3px; border:none; cursor:pointer;">CARD 3</button>
        </div>
    `;

    window.playCardFlip = function(pick) {
        const bet = Number(document.getElementById("cfBet").value) || 500;
        if (game.balance < bet) return alert("Low Balance!");
        game.balance -= bet; updateBalance();

        const winningCard = Math.floor(Math.random() * 3) + 1;
        let cards = ["🃏", "🃏", "🃏"];
        cards[winningCard - 1] = "👑 GOLD";
        document.getElementById("cfDisplay").innerText = cards.join(" | ");

        if (pick === winningCard) {
            const won = bet * 3; game.balance += won; addXP(110); playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 GOLD CARD REVEALED! Won ₹${won}`);
        } else {
            playSound('lose'); alert("❌ JOKER HIT! Lost bet.");
        }
        updateBalance(); saveGame();
    };
})();
