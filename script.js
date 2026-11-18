document.addEventListener("DOMContentLoaded", function () {
  var gameBalance = 10000;
  var userXP = parseInt(localStorage.getItem('rwin_xp') || '0');
  var flying = false, m = 1.00, timer = null;

  function getLevel() { return Math.floor(userXP / 200) + 1; }

  function addXP(amount) {
    userXP += amount;
    localStorage.setItem('rwin_xp', userXP.toString());
    updateUIState();
  }

  function updateUIState() {
    var tier = localStorage.getItem('rwin_tier') || 'free';
    var badge = document.getElementById("userTierBadge");
    if (badge) {
      if (tier === 'vip_200') badge.innerText = "SUPER VIP (6M)";
      else if (tier === 'platinum_99') badge.innerText = "PLATINUM (4M)";
      else if (tier === 'gold_49') badge.innerText = "GOLD (2M)";
      else if (tier === 'starter_9') badge.innerText = "STARTER (16D)";
      else badge.innerText = "FREE TIER";
    }

    var lvl = getLevel();
    var currentLvlXP = userXP % 200;
    var lEl = document.getElementById("levelText"); if (lEl) lEl.innerText = "LVL " + lvl;
    var xEl = document.getElementById("xpText"); if (xEl) xEl.innerText = currentLvlXP + "/200 XP";
    var bar = document.getElementById("xpBarInner"); if (bar) bar.style.width = ((currentLvlXP / 200) * 100) + "%";

    var balEl = document.getElementById("balanceText");
    if (balEl) balEl.innerText = "₹" + gameBalance.toLocaleString();
  }

  function showModal(title, msg, icon, isWin) {
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMsg").innerText = msg;
    document.getElementById("modalIcon").innerText = icon || (isWin ? "🎉" : "💥");
    document.getElementById("customModal").style.display = "flex";
  }

  var closeModalBtn = document.getElementById("closeModalBtn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      document.getElementById("customModal").style.display = "none";
    });
  }

  var resetBtn = document.getElementById("resetCoinsBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      gameBalance = 10000;
      updateUIState();
      showModal("🔄 BALANCE RESET", "VIP practice coins restored to ₹10,000!", "💰", true);
    });
  }

  var exitBtn = document.getElementById("exitGameBtn");
  if (exitBtn) {
    exitBtn.addEventListener("click", function () {
      document.getElementById('arenaHub').style.display = 'block';
      document.getElementById('activeGameArea').style.display = 'none';
      document.getElementById('activeGameArea').innerHTML = '';
      document.getElementById('backBar').style.display = 'none';
      if (timer) clearInterval(timer);
      flying = false;
    });
  }

  var cardButtons = document.querySelectorAll(".game-card-btn");
  cardButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var gameId = this.getAttribute("data-game");
      var title = this.getAttribute("data-title");
      openGame(gameId, title);
    });
  });

  function openGame(gameId, title) {
    document.getElementById('arenaHub').style.display = 'none';
    document.getElementById('backBar').style.display = 'flex';
    document.getElementById('activeGameTitle').innerText = title;

    var container = document.getElementById('activeGameArea');
    container.style.display = 'block';

    if (gameId === 'color') {
      container.innerHTML = `
        <div style="background: linear-gradient(135deg, #0d111a 0%, #161b22 100%); border: 1.5px solid rgba(210, 153, 34, 0.4); border-radius: 18px; padding: 16px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.6);">
          <div style="display:flex; justify-content:space-between; background:#080b11; padding:8px 12px; border-radius:10px; margin-bottom:14px; font-size:11px; font-weight:700; border: 1px solid rgba(255,255,255,0.05);">
            <span style="color:#d29922; border-bottom:2px solid #d29922; padding-bottom:2px;">👑 WinGo 30s Elite</span>
            <span style="color:#94a3b8;">WinGo 1Min</span>
          </div>
          
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:12px;">
            <button class="wg-btn" data-sel="GREEN" data-m="2" style="padding:14px 8px; background: linear-gradient(135deg, #10b981, #059669); color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer; box-shadow: 0 4px 12px rgba(16,185,129,0.3); transition: transform 0.1s;">🟢 Green (2X)</button>
            <button class="wg-btn" data-sel="VIOLET" data-m="4.5" style="padding:14px 8px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer; box-shadow: 0 4px 12px rgba(139,92,246,0.3); transition: transform 0.1s;">🟣 Violet (4.5X)</button>
            <button class="wg-btn" data-sel="RED" data-m="2" style="padding:14px 8px; background: linear-gradient(135deg, #ef4444, #dc2626); color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer; box-shadow: 0 4px 12px rgba(239,68,68,0.3); transition: transform 0.1s;">🔴 Red (2X)</button>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:14px;">
            <button class="wg-btn" data-sel="BIG" data-m="2" style="padding:14px; background: linear-gradient(135deg, #f59e0b, #d97706); color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer; box-shadow: 0 4px 12px rgba(245,158,11,0.3);">⚡ Big 5-9 (2X)</button>
            <button class="wg-btn" data-sel="SMALL" data-m="2" style="padding:14px; background: linear-gradient(135deg, #3b82f6, #2563eb); color:#fff; font-weight:800; border-radius:10px; border:none; cursor:pointer; box-shadow: 0 4px 12px rgba(59,130,246,0.3);">💧 Small 0-4 (2X)</button>
          </div>
        </div>
      `;
      container.querySelectorAll(".wg-btn").forEach(function (b) {
        b.addEventListener("click", function () {
          var sel = this.getAttribute("data-sel");
          var multi = parseFloat(this.getAttribute("data-m"));
          playWinGo(sel, multi);
        });
      });
    } else if (gameId === 'aviator') {
      container.innerHTML = `
        <div style="background: linear-gradient(135deg, #0d111a 0%, #161b22 100%); border: 1.5px solid rgba(0, 229, 255, 0.4); border-radius: 18px; padding: 16px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.6);">
          <div class="aviator-canvas" style="background: radial-gradient(circle, #111827 0%, #030712 100%); border: 1px solid rgba(0,229,255,0.2); border-radius: 14px; padding: 30px 10px; margin-bottom: 14px; position:relative; overflow:hidden;">
            <div style="position:absolute; top:8px; left:12px; font-size:10px; color:#00e5ff; font-weight:700; letter-spacing:1px;">✈️ RWIN RADAR v2.4</div>
            <div id="jetMulti" style="font-size:44px; font-weight:900; color:#fff; text-shadow: 0 0 25px rgba(0,229,255,0.6); margin-top:10px;">1.00x</div>
            <div style="font-size:11px; color:#94a3b8; margin-top:4px; font-weight:600;">READY FOR TAKEOFF</div>
          </div>
          <button id="jetBtn" style="width:100%; padding:14px; background: linear-gradient(135deg, #10b981, #059669); color:#fff; font-weight:800; font-size:15px; border-radius:12px; border:none; cursor:pointer; box-shadow: 0 6px 20px rgba(16,185,129,0.4); transition: transform 0.1s;">BET ₹100 & LAUNCH 🚀</button>
        </div>
      `;
      document.getElementById("jetBtn").addEventListener("click", launchJet);
    } else {
      var nameUpper = gameId.replace(/_/g, ' ').toUpperCase();
      container.innerHTML = `
        <div style="background: linear-gradient(135deg, #0d111a 0%, #161b22 100%); border: 1.5px solid rgba(210, 153, 34, 0.4); border-radius: 18px; padding: 20px; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.6);">
          <div style="font-size:48px; margin-bottom:8px; filter: drop-shadow(0 0 10px rgba(210,153,34,0.4));">💎</div>
          <div style="font-size:18px; font-weight:900; color:#00e5ff; letter-spacing:1px;">${nameUpper}</div>
          <div style="font-size:12px; color:#94a3b8; margin:8px 0 16px 0;">Elite Multiplier: <b style="color:#10b981;">2.20X</b></div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <button class="gen-btn" data-opt="OPTION A" style="padding:14px; background: linear-gradient(135deg, #00e5ff, #0088ff); color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer; box-shadow: 0 4px 15px rgba(0,229,255,0.3);">OPTION A</button>
            <button class="gen-btn" data-opt="OPTION B" style="padding:14px; background: linear-gradient(135deg, #ffd700, #ff8c00); color:#000; font-weight:800; border-radius:10px; border:none; cursor:pointer; box-shadow: 0 4px 15px rgba(255,215,0,0.3);">OPTION B</button>
          </div>
        </div>
      `;
      container.querySelectorAll(".gen-btn").forEach(function (b) {
        b.addEventListener("click", function () {
          var opt = this.getAttribute("data-opt");
          playGeneric(nameUpper, opt);
        });
      });
    }
  }

  function playWinGo(sel, multi) {
    if (gameBalance < 100) return showModal("Low Balance", "Reset coins to play!", "⚠️", false);
    gameBalance -= 100;
    addXP(50);
    if (Math.random() < 0.5) {
      var won = Math.floor(100 * multi); gameBalance += won; showModal("WIN!", "Selected " + sel + "! Won ₹" + won + " (+50 XP)", "🎨", true);
    } else {
      showModal("LOST", "Selected " + sel + "! Try again (+50 XP)", "💥", false);
    }
    updateUIState();
  }

  function launchJet() {
    var btn = document.getElementById("jetBtn");
    if (!flying) {
      if (gameBalance < 100) return showModal("Low Balance", "Reset coins to play!", "⚠️", false);
      gameBalance -= 100; addXP(50);
      flying = true; m = 1.00;
      btn.innerText = "CASHOUT 💰"; btn.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
      var crashAt = (Math.random() * 3 + 1.1).toFixed(2);
      timer = setInterval(function () {
        m += 0.05;
        var el = document.getElementById("jetMulti"); if (el) el.innerText = m.toFixed(2) + "x";
        if (m >= crashAt) {
          clearInterval(timer); flying = false;
          if (el) el.innerText = "FLEW AWAY!";
          btn.innerText = "BET ₹100 & LAUNCH 🚀"; btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
          showModal("FLEW AWAY", "Crashed @ " + m.toFixed(2) + "x (+50 XP)", "✈️", false);
        }
      }, 100);
    } else {
      clearInterval(timer); flying = false;
      var won = Math.floor(100 * m); gameBalance += won; updateUIState();
      showModal("CASHED OUT!", "Cashed out @ " + m.toFixed(2) + "x\nWon ₹" + won + " (+50 XP)", "✈️", true);
      btn.innerText = "BET ₹100 & LAUNCH 🚀"; btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
    }
  }

  function playGeneric(gName, opt) {
    if (gameBalance < 500) return showModal("Low Balance", "Reset coins to play!", "⚠️", false);
    gameBalance -= 500; addXP(50);
    if (Math.random() < 0.48) {
      var won = 1100; gameBalance += won; showModal("ROUND WIN!", opt + " Won! ₹" + won + " (+50 XP)", "🎉", true);
    } else {
      showModal("ROUND LOST", opt + " Lost (+50 XP)", "💥", false);
    }
    updateUIState();
  }

  updateUIState();
});
                    
          
