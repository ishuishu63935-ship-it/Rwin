
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

  // GUARANTEED TOUCH EVENT LISTENERS FOR ALL 20 GAMES
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
        <div style="background:#0b101d; border:1px solid #1e293b; border-radius:14px; padding:12px; text-align:center;">
          <div style="display:flex; justify-content:space-between; background:#050811; padding:6px; border-radius:8px; margin-bottom:10px; font-size:10px; font-weight:700;">
            <span style="color:var(--neon-pink); border-bottom:2px solid var(--neon-pink);">WinGo 30s</span>
            <span style="color:#94a3b8;">WinGo 1Min</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:6px; margin-bottom:10px;">
            <button class="wg-btn" data-sel="GREEN" data-m="2" style="padding:12px; background:#10b981; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">Green (2X)</button>
            <button class="wg-btn" data-sel="VIOLET" data-m="4.5" style="padding:12px; background:#8b5cf6; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">Violet (4.5X)</button>
            <button class="wg-btn" data-sel="RED" data-m="2" style="padding:12px; background:#ef4444; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">Red (2X)</button>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
            <button class="wg-btn" data-sel="BIG" data-m="2" style="padding:12px; background:#f59e0b; color:#000; font-weight:800; border-radius:8px; border:none; cursor:pointer;">Big (2X)</button>
            <button class="wg-btn" data-sel="SMALL" data-m="2" style="padding:12px; background:#3b82f6; color:#fff; font-weight:800; border-radius:8px; border:none; cursor:pointer;">Small (2X)</button>
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
        <div style="background:#0b101d; border:1px solid #1e293b; border-radius:14px; padding:12px; text-align:center;">
          <div class="aviator-canvas">
            <div id="jetMulti" style="font-size:38px; font-weight:800; color:#fff;">1.00x</div>
          </div>
          <button id="jetBtn" style="width:100%; margin-top:10px; padding:12px; background:#10b981; color:#000; font-weight:800; border-radius:8px; border:none; cursor:pointer;">BET 100 & LAUNCH</button>
        </div>
      `;
      document.getElementById("jetBtn").addEventListener("click", launchJet);
    } else {
      var nameUpper = gameId.replace(/_/g, ' ').toUpperCase();
      container.innerHTML = `
        <div style="background:#0b101d; border:1px solid #1e293b; border-radius:14px; padding:16px; text-align:center;">
          <div style="font-size:40px; margin-bottom:6px;">🎰</div>
          <div style="font-size:16px; font-weight:800; color:var(--neon-blue);">${nameUpper}</div>
          <div style="font-size:11px; color:#94a3b8; margin:6px 0 14px 0;">Multiplier: <b style="color:var(--neon-green);">2.20X</b></div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <button class="gen-btn" data-opt="OPTION A" style="padding:12px; background:var(--neon-blue); color:#000; font-weight:800; border-radius:8px; border:none; cursor:pointer;">OPTION A</button>
            <button class="gen-btn" data-opt="OPTION B" style="padding:12px; background:var(--neon-gold); color:#000; font-weight:800; border-radius:8px; border:none; cursor:pointer;">OPTION B</button>
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
      btn.innerText = "CASHOUT"; btn.style.background = "#f59e0b";
      var crashAt = (Math.random() * 3 + 1.1).toFixed(2);
      timer = setInterval(function () {
        m += 0.05;
        var el = document.getElementById("jetMulti"); if (el) el.innerText = m.toFixed(2) + "x";
        if (m >= crashAt) {
          clearInterval(timer); flying = false;
          if (el) el.innerText = "FLEW AWAY!";
          btn.innerText = "BET 100 & LAUNCH"; btn.style.background = "#10b981";
          showModal("FLEW AWAY", "Crashed @ " + m.toFixed(2) + "x (+50 XP)", "✈️", false);
        }
      }, 100);
    } else {
      clearInterval(timer); flying = false;
      var won = Math.floor(100 * m); gameBalance += won; updateUIState();
      showModal("CASHED OUT!", "Cashed out @ " + m.toFixed(2) + "x\nWon ₹" + won + " (+50 XP)", "✈️", true);
      btn.innerText = "BET 100 & LAUNCH"; btn.style.background = "#10b981";
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
    
