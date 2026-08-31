/* MODULE: NINJA SHURIKEN CATCH (SUPER VIP LEVEL 220) */
(function initNinjaDodge() {
    console.log("🥷 Ninja Dodge Loaded!");
    const container = document.getElementById("game-ninjadodge");
    if(!container) return;

    container.innerHTML = `
        <div class="action-box">
            <h2 style="color:var(--neon-pink);">🥷 Cyber Ninja Shuriken Catch</h2>
            <p style="font-size:11px; color:#94a3b8;">Super VIP Level 220 Required • Catch or dodge flying shurikens!</p>
            <div id="ninjaDisplay" style="font-size:36px; margin:15px 0;">🥷 🗡️</div>
            <input type="number" id="ninjaBet" value="1000" style="padding:8px; width:50%; text-align:center; border-radius:6px; background:#0f172a; color:#fff; border:1px solid #334155;">
            <br><br>
            <button onclick="window.ninjaMove('CATCH')" style="padding:10px 18px; background:var(--neon-pink); color:#fff; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">🖐️ CATCH (2.5X)</button>
            <button onclick="window.ninjaMove('DODGE')" style="padding:10px 18px; background:var(--neon-blue); color:#000; border:none; font-weight:800; border-radius:8px; margin:3px; cursor:pointer;">💨 DODGE (1.8X)</button>
        </div>
    `;

    window.ninjaMove = function(action) {
        const bet = Number(document.getElementById("ninjaBet").value) || 1000;
        if (game.balance < bet) return alert("Low Balance!");

        game.balance -= bet;
        updateBalance();

        const successChance = action === 'CATCH' ? 0.4 : 0.6;
        const multi = action === 'CATCH' ? 2.5 : 1.8;
        const isSuccess = Math.random() < successChance;

        if (isSuccess) {
            const won = Math.floor(bet * multi);
            game.balance += won;
            addXP(240);
            playSound('win');
            document.getElementById("ninjaDisplay").innerText = "✨ PERFECT NINJA MOVE!";
            if (typeof confetti === 'function') confetti();
            alert(`🎉 SHURIKEN MASTERED! Won ₹${won}`);
        } else {
            playSound('lose');
            document.getElementById("ninjaDisplay").innerText = "💥 STRUCK BY SHURIKEN!";
            alert("❌ MOVE FAILED!");
        }
        updateBalance();
        saveGame();
    };
})();
