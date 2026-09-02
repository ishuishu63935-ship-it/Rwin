/* MODULE: CYBER BLACKJACK 21 */
(function initBlackjackModule() {
    console.log("🃏 Cyber Blackjack 21 Engine Loaded!");
    const container = document.getElementById("game-blackjack");
    if(!container) return;

    let playerTotal = 0;
    let dealerTotal = 0;
    let bjActive = false;
    let bjBetAmt = 0;

    container.innerHTML = `
        <div class="action-box" style="background:#0b101d; border:1px solid #1e293b; border-radius:18px; padding:18px; text-align:center;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:14px; color:var(--neon-blue); font-weight:700;">🃏 Cyber Blackjack 21</span>
                <span style="font-size:11px; color:#94a3b8;">Super VIP Exclusive</span>
            </div>

            <!-- Table Hands Display -->
            <div style="background:#050811; border:1px solid #334155; border-radius:14px; padding:15px; margin:15px 0;">
                <div style="margin-bottom:10px;">
                    <span style="font-size:11px; color:#94a3b8;">DEALER HAND: </span>
                    <b id="dealerHandScore" style="color:var(--neon-gold); font-size:16px;">0</b>
                </div>
                <hr style="border:0; border-top:1px dashed #1e293b; margin:10px 0;">
                <div>
                    <span style="font-size:11px; color:#94a3b8;">YOUR HAND: </span>
                    <b id="playerHandScore" style="color:var(--neon-green); font-size:18px;">0</b>
                </div>
            </div>

            <!-- Quick Bet Controls -->
            <div style="display:flex; gap:6px; margin-bottom:14px;">
                <input type="number" id="bjBetInput" value="500" style="padding:10px; width:50%; text-align:center; border-radius:8px; border:1px solid #334155; background:#0f172a; color:#fff; font-weight:700;">
                <button onclick="document.getElementById('bjBetInput').value = Math.floor(Number(document.getElementById('bjBetInput').value)*2)" style="padding:8px 12px; background:#1e293b; color:var(--neon-gold); border:1px solid var(--neon-gold); border-radius:8px;">2X</button>
                <button onclick="document.getElementById('bjBetInput').value = window.game.balance" style="padding:8px 12px; background:#1e293b; color:var(--neon-pink); border:1px solid var(--neon-pink); border-radius:8px;">MAX</button>
            </div>

            <button id="dealBjBtn" onclick="window.dealBlackjack()" style="width:100%; padding:14px; background:var(--neon-blue); color:#000; font-weight:800; border-radius:12px; font-size:16px;">DEAL CARDS</button>
            
            <div id="bjActionsRow" style="display:none; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
                <button onclick="window.hitBlackjack()" style="padding:12px; background:var(--neon-green); color:#000; font-weight:800; border-radius:10px;">🖐️ HIT</button>
                <button onclick="window.standBlackjack()" style="padding:12px; background:var(--neon-gold); color:#000; font-weight:800; border-radius:10px;">🛑 STAND</button>
            </div>
        </div>
    `;

    window.dealBlackjack = function() {
        bjBetAmt = Number(document.getElementById("bjBetInput").value) || 500;
        if (window.game.balance < bjBetAmt) {
            window.showCasinoModal(false, "Low Balance", "0", "⚠️");
            return;
        }

        window.game.balance -= bjBetAmt;
        window.updateBalance();
        window.addXP(85);

        bjActive = true;
        playerTotal = Math.floor(Math.random() * 8) + 12; // Initial 12-19
        dealerTotal = Math.floor(Math.random() * 7) + 10;

        document.getElementById("playerHandScore").innerText = playerTotal;
        document.getElementById("dealerHandScore").innerText = dealerTotal + " + ?";

        document.getElementById("dealBjBtn").style.display = "none";
        document.getElementById("bjActionsRow").style.display = "grid";
    };

    window.hitBlackjack = function() {
        if (!bjActive) return;
        playerTotal += Math.floor(Math.random() * 10) + 1;
        document.getElementById("playerHandScore").innerText = playerTotal;

        if (playerTotal > 21) {
            bjActive = false;
            document.getElementById("dealBjBtn").style.display = "block";
            document.getElementById("bjActionsRow").style.display = "none";
            window.showCasinoModal(false, "Bust Over 21!", "₹" + bjBetAmt, "🃏");
        }
    };

    window.standBlackjack = function() {
        if (!bjActive) return;
        bjActive = false;

        dealerTotal += Math.floor(Math.random() * 8) + 3;
        document.getElementById("dealerHandScore").innerText = dealerTotal;

        document.getElementById("dealBjBtn").style.display = "block";
        document.getElementById("bjActionsRow").style.display = "none";

        if (dealerTotal > 21 || playerTotal > dealerTotal) {
            const won = bjBetAmt * 2;
            window.game.balance += won;
            window.showCasinoModal(true, "Blackjack Win!", "₹" + won, "🃏");
        } else if (playerTotal === dealerTotal) {
            window.game.balance += bjBetAmt;
            window.showCasinoModal(true, "Push (Tie)", "₹" + bjBetAmt, "🤝");
        } else {
            window.showCasinoModal(false, "Dealer Won Round", "₹" + bjBetAmt, "🃏");
        }

        window.updateBalance();
        window.saveGame();
    };
})();
      
