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

console.log("🚀 RWIN Engine V6 Active | Hardware Device ID:", getOrCreateDeviceId());

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
        REAL-TIME WEB AUDIO SYNTHESIZER
========================================== */
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playSound(type) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'win') {
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start(); osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'lose') {
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.start(); osc.stop(ctx.currentTime + 0.4);
        } else if (type === 'click') {
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
            osc.start(); osc.stop(ctx.currentTime + 0.05);
        }
    } catch (e) {
        console.error("Audio error:", e);
    }
}

// Add click sounds to all buttons
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => playSound('click'));
    });
});

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
    const xpText = document.getElementById("xpText");

    if (level) level.innerText = "Level " + game.level;
    if (fill) fill.style.width = game.xp + "%";
    if (xpText) xpText.innerText = "XP : " + game.xp + " / 100";
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
    const betStatus = $("#betStatus");

    $$(".betBtn").forEach(btn => {
        btn.onclick = () => {
            playSound('click');
            $$(".betBtn").forEach(b => { b.style.outline = "none"; });
            btn.style.outline = "3px solid #00E5FF";
            game.selectedBet = Number(btn.innerText);
            if (betStatus) betStatus.innerText = "Selected: " + game.selectedBet + " Coins";
        };
    });

    $$(".colorGrid button").forEach(btn => {
        btn.onclick = () => {
            playSound('click');
            $$(".colorGrid button").forEach(b => { b.style.outline = "none"; });
            btn.style.outline = "3px solid #00E5FF";
            game.selectedColor = btn.innerText.trim();
        };
    });

    document.querySelectorAll(".numberPanel .numberGrid button").forEach(btn => {
        btn.onclick = () => {
            playSound('click');
            document.querySelectorAll(".numberPanel .numberGrid button").forEach(b => { b.style.outline = "none"; });
            btn.style.outline = "3px solid yellow";
            game.selectedNumber = Number(btn.innerText);
        };
    });

    const bigBtn = $(".bigBtn");
    if (bigBtn) bigBtn.onclick = () => { playSound('click'); game.selectedSize = "BIG"; };

    const smallBtn = $(".smallBtn");
    if (smallBtn) smallBtn.onclick = () => { playSound('click'); game.selectedSize = "SMALL"; };

    if (playBtn) {
        playBtn.onclick = () => {
            playSound('click');
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
        RESULT ENGINE (WITH SUSPENSE & CONFETTI)
========================================== */
let winStreak = 0;

function generateResult() {
    const number = Math.floor(Math.random() * 10);
    let color = (number === 0 || number === 5) ? "VIOLET" : (number % 2 === 0 ? "RED" : "GREEN");
    const size = number >= 5 ? "BIG" : "SMALL";
    return { number, color, size };
}

function finishRound() {
    const statusText = $("#statusText");
    const resultText = $("#resultText");

    // 1. Rolling Suspense Animation (1.5 Seconds)
    let rollInterval = setInterval(() => {
        if (resultText) {
            const tempNum = Math.floor(Math.random() * 10);
            resultText.innerText = `🎲 Rolling: ${tempNum}...`;
            resultText.style.color = "#00E5FF";
        }
    }, 80);

    setTimeout(() => {
        clearInterval(rollInterval);
        const result = generateResult();
        let win = false;

        if (game.selectedColor === result.color) win = true;
        if (game.selectedNumber === result.number) win = true;
        if (game.selectedSize === result.size) win = true;

        if (win) {
            winStreak++;
            game.balance += game.selectedBet * 2;
            game.xp += 10;
            
            if (statusText) {
                statusText.innerText = winStreak > 1 ? `🎉 WIN (${winStreak}X STREAK 🔥)` : "🎉 BIG WIN!";
            }

            playSound('win');

            // Trigger Fireworks / Confetti
            if (typeof confetti === 'function') {
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            }
        } else {
            winStreak = 0;
            if (game.xp > 0) game.xp -= 2;
            if (statusText) statusText.innerText = "❌ LOSE";
            playSound('lose');
        }

        if (resultText) {
            resultText.style.color = "#FFF";
            resultText.innerText = `${result.number} | ${result.color} | ${result.size}`;
        }

        updateBalance();
        updateXP();
        updateHistory(result);
        checkLevelUp();
        clearSelection();
        saveGame();
    }, 1500);
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
    const betStatus = $("#betStatus");
    if (playStatus) playStatus.innerText = "Choose Coins + Color / Number / BIG-SMALL";
    if (betStatus) betStatus.innerText = "No Coins Selected";
}

/* ==========================================
        STRICT RESET & COIN LOCK
========================================== */
const resetBtn = $("#resetCoinsBtn");
if (resetBtn) {
    resetBtn.onclick = () => {
        playSound('click');
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
console.log("🎉 RWIN ENGINE V6 LOCKED & READY");
            
