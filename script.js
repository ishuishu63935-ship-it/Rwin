"use strict";

/* ==========================================
        HARDWARE DEVICE FINGERPRINT ENGINE
========================================== */
function getOrCreateDeviceId() {
    const raw = navigator.userAgent + screen.width + "x" + screen.height + navigator.language;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        hash = (hash << 5) - hash + raw.charCodeAt(i);
        hash |= 0;
    }
    return 'DEV_HW_' + Math.abs(hash);
}

console.log("🚀 RWIN Engine V5 Active | Hardware Device ID:", getOrCreateDeviceId());

/* ==========================================
        HELPERS
========================================== */
const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

/* ==========================================
        GAME DATA
========================================== */
const game = {
    balance: 0, // Initialized to 0 to prevent 10,000 auto-overwrite bug
    xp: 0,
    level: 1,
    membership: false,
    membershipPlan: "Free",
    membershipExpiry: null,
    hasClaimedFreeCoins: false,
    history: [],
    timer: 30,
    selectedBet: 0,
    selectedColor: null,
    selectedNumber: null,
    selectedSize: null
};

/* ==========================================
        LOAD & SAVE WITH CLOUD SYNC
========================================== */
function loadGame() {
    const data = localStorage.getItem("rwinGame") || localStorage.getItem("rwinCloud");
    if (!data) return;

    try {
        const parsedData = JSON.parse(data);
        Object.assign(game, parsedData);
        updateBalance();
        updateXP();
        updateMembership();
    } catch (e) {
        console.error("Data load error", e);
    }
}

window.loadRwinFromCloud = (cloudData) => {
    if (cloudData) {
        Object.assign(game, cloudData);
        updateBalance();
        updateXP();
        updateMembership();
    }
};

function saveGame() {
    localStorage.setItem("rwinGame", JSON.stringify(game));
    localStorage.setItem("rwinCloud", JSON.stringify(game));

    if (window.syncRwinToCloud && typeof window.syncRwinToCloud === 'function') {
        window.syncRwinToCloud(game);
    }
}

/* ==========================================
        BALANCE & UI UPDATES
========================================== */
function updateBalance() {
    const a = document.getElementById("balanceText");
    const b = document.getElementById("gameBalance");

    if (a) a.innerText = "₹" + game.balance;
    if (b) b.innerText = "₹" + game.balance;
}

function updateXP() {
    const level = document.getElementById("levelText");
    const fill = document.getElementById("xpFill");

    if (level) level.innerText = "Level " + game.level;
    if (fill) fill.style.width = game.xp + "%";
}

function updateMembership() {
    const box = document.getElementById("membershipStatus");
    if (!box) return;

    if (membershipActive()) {
        box.innerHTML = "👑 " + game.membershipPlan;
    } else {
        box.innerHTML = "🆓 Free Plan";
    }
}

function membershipActive() {
    if (!game.membership) return false;
    if (!game.membershipExpiry) return true;

    const today = new Date();
    const expiry = new Date(game.membershipExpiry);

    if (today > expiry) {
        game.membership = false;
        game.membershipPlan = "Free";
        game.membershipExpiry = null;
        saveGame();
        return false;
    }
    return true;
}

/* ==========================================
        INITIALIZE
========================================== */
loadGame();

/* ==========================================
        TIMER ENGINE
========================================== */
if (document.getElementById("timer") !== null) {
    const timerText = $("#timer");

    function updateTimer() {
        if (timerText) {
            timerText.innerText = game.timer;
        }
    }

    updateTimer();

    setInterval(() => {
        game.timer--;

        if (game.timer < 0) {
            game.timer = 30;
        }

        updateTimer();

        if (game.timer === 0) {
            finishRound();
        }
    }, 1000);
}

/* ==========================================
        BET ENGINE
========================================== */
if (document.getElementById("timer") !== null) {
    const playBtn = $("#playBtn");
    const playStatus = $("#playStatus");

    $$(".betBtn").forEach(btn => {
        btn.onclick = () => {
            $$(".betBtn").forEach(b => { b.style.outline = "none"; });
            btn.style.outline = "3px solid #00E5FF";
            game.selectedBet = Number(btn.innerText);
        };
    });

    $$(".colorGrid button").forEach(btn => {
        btn.onclick = () => {
            $$(".colorGrid button").forEach(b => { b.style.outline = "none"; });
            btn.style.outline = "3px solid #00E5FF";
            game.selectedColor = btn.innerText.trim();
        };
    });

    document.querySelectorAll(".numberPanel .numberGrid button").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".numberPanel .numberGrid button").forEach(b => { b.style.outline = "none"; });
            btn.style.outline = "3px solid yellow";
            game.selectedNumber = Number(btn.innerText);
        };
    });

    const bigBtn = $(".bigBtn");
    if (bigBtn) bigBtn.onclick = () => { game.selectedSize = "BIG"; };

    const smallBtn = $(".smallBtn");
    if (smallBtn) smallBtn.onclick = () => { game.selectedSize = "SMALL"; };

    if (playBtn) {
        playBtn.onclick = () => {
            if (game.selectedBet <= 0) {
                playStatus.innerText = "❌ Select Coins";
                return;
            }

            if (!game.selectedColor && game.selectedNumber === null && !game.selectedSize) {
                playStatus.innerText = "❌ Select Bet";
                return;
            }

            if (game.balance < game.selectedBet) {
                playStatus.innerText = "❌ Not Enough Coins";
                return;
            }

            game.balance -= game.selectedBet;
            updateBalance();
            saveGame();
            playStatus.innerText = "✅ Bet Accepted";
        };
    }
}

/* ==========================================
        RESULT ENGINE
========================================== */
function generateResult() {
    const number = Math.floor(Math.random() * 10);
    let color = (number === 0 || number === 5) ? "VIOLET" : (number % 2 === 0 ? "RED" : "GREEN");
    const size = number >= 5 ? "BIG" : "SMALL";
    return { number, color, size };
}

function finishRound() {
    const result = generateResult();
    let win = false;

    if (game.selectedColor === result.color) win = true;
    if (game.selectedNumber === result.number) win = true;
    if (game.selectedSize === result.size) win = true;

    const statusText = $("#statusText");
    const resultText = $("#resultText");

    if (win) {
        game.balance += game.selectedBet * 2;
        game.xp += 10;
        if (statusText) statusText.innerText = "🎉 WIN";
    } else {
        if (game.xp > 0) game.xp -= 2;
        if (statusText) statusText.innerText = "❌ LOSE";
    }

    if (resultText) {
        resultText.innerText = result.number + " | " + result.color + " | " + result.size;
    }

    updateBalance();
    updateXP();
    updateHistory(result);
    checkLevelUp();
    clearSelection();
    saveGame();
}

function checkLevelUp() {
    while (game.xp >= 100) {
        game.xp -= 100;
        game.level++;
    }
    updateXP();
}

function updateHistory(result) {
    game.history.unshift({ number: result.number, color: result.color, size: result.size });
    if (game.history.length > 10) game.history.pop();
    loadHistory();
}

function loadHistory() {
    const recent = $("#recentCard");
    if (!recent) return;
    recent.innerHTML = game.history.length === 0 ? "<p>No History</p>" : "";
    game.history.forEach(item => {
        recent.innerHTML += `<p>🎯 ${item.number} | ${item.color} | ${item.size}</p>`;
    });
}

function clearSelection() {
    game.selectedBet = 0;
    game.selectedColor = null;
    game.selectedNumber = null;
    game.selectedSize = null;

    $$(".betBtn").forEach(btn => { btn.style.outline = "none"; });
    $$(".colorGrid button").forEach(btn => { btn.style.outline = "none"; });
    document.querySelectorAll(".numberPanel .numberGrid button").forEach(btn => { btn.style.outline = "none"; });

    const playStatus = $("#playStatus");
    if (playStatus) playStatus.innerText = "Choose Coins + Color / Number / BIG-SMALL";
}

/* ==========================================
        STRICT RESET & COIN LOCK
========================================== */
const resetBtn = $("#resetCoinsBtn");
if (resetBtn) {
    resetBtn.onclick = () => {
        if (!membershipActive()) {
            alert("🔒 कॉइन्स खत्म! Unlimited Reset करने के लिए VIP Membership लें।");
            window.location.href = "wallet.html";
            return;
        }
        game.balance = 10000;
        updateBalance();
        saveGame();
        alert("🔄 Coins Reset Successful!");
    };
}

loadHistory();
console.log("🎉 RWIN ENGINE V5 LOCKED & READY");
