"use strict";

/* HARDWARE DEVICE FINGERPRINT ENGINE */
function getOrCreateDeviceId() {
    const raw = navigator.userAgent + screen.width + "x" + screen.height + navigator.language;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        hash = (hash << 5) - hash + raw.charCodeAt(i);
        hash |= 0;
    }
    return 'DEV_HW_' + Math.abs(hash);
}

const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

const game = {
    balance: 0,
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

/* AUDIO SYNTHESIZER */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    try {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);

        if (type === 'win') {
            osc.frequency.setValueAtTime(440, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start(); osc.stop(audioCtx.currentTime + 0.3);
        } else if (type === 'lose') {
            osc.frequency.setValueAtTime(250, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start(); osc.stop(audioCtx.currentTime + 0.3);
        }
    } catch(e) {}
}

/* NO AUTO RESET - STRICT BALANCE PERSISTENCE */
function loadGame() {
    const hwId = getOrCreateDeviceId();
    const data = localStorage.getItem("rwinGame") || localStorage.getItem("rwinCloud");

    if (data) {
        try { Object.assign(game, JSON.parse(data)); } catch (e) {}
    } else {
        // FIRST TIME ON THIS DEVICE
        game.balance = 10000;
        game.hasClaimedFreeCoins = true;
        saveGame();
    }
    updateBalance();
}

function saveGame() {
    localStorage.setItem("rwinGame", JSON.stringify(game));
    localStorage.setItem("rwinCloud", JSON.stringify(game));
    if (window.syncRwinToCloud) window.syncRwinToCloud(game);
}

function updateBalance() {
    const b = document.getElementById("balanceText");
    if (b) b.innerText = "₹" + game.balance;
}

function membershipActive() {
    if (!game.membership) return false;
    if (!game.membershipExpiry) return true;
    return new Date() < new Date(game.membershipExpiry);
}

/* COLOR PREDICTION TIMER (FIXED COUNTDOWN) */
let timerInterval = setInterval(() => {
    game.timer--;
    const t = $("#timer");
    if (t) t.innerText = game.timer;

    if (game.timer <= 0) {
        game.timer = 30;
        finishColorRound();
    }
}, 1000);

window.setBet = (amt) => { game.selectedBet = amt; if($("#playStatus")) $("#playStatus").innerText = "Coins Selected: " + amt; };
window.setColor = (col) => { game.selectedColor = col; };
window.setNumber = (num) => { game.selectedNumber = num; };
window.setSize = (sz) => { game.selectedSize = sz; };

if ($("#playBtn")) {
    $("#playBtn").onclick = () => {
        if (!game.selectedBet) return alert("Select Bet Coins!");
        if (!game.selectedColor && game.selectedNumber === null && !game.selectedSize) return alert("Select Color, Number, or Size!");
        if (game.balance < game.selectedBet) return alert("Insufficient Balance!");

        game.balance -= game.selectedBet;
        updateBalance(); saveGame();
        $("#playStatus").innerText = "✅ Bet Placed Successfully!";
    };
}

function finishColorRound() {
    const num = Math.floor(Math.random() * 10);
    const col = (num === 0 || num === 5) ? "VIOLET" : (num % 2 === 0 ? "RED" : "GREEN");
    const sz = num >= 5 ? "BIG" : "SMALL";

    let win = false;
    if (game.selectedColor === col || game.selectedNumber === num || game.selectedSize === sz) win = true;

    const res = $("#resultText");
    const st = $("#statusText");

    if (win) {
        game.balance += game.selectedBet * 2;
        playSound('win');
        if(st) st.innerText = "🎉 WIN!";
        if (typeof confetti === 'function') confetti();
    } else {
        if (game.selectedBet > 0) playSound('lose');
        if(st) st.innerText = "❌ LOSE";
    }

    if(res) res.innerText = `${num} | ${col} | ${sz}`;
    updateBalance();
    
    // Clear selection
    game.selectedBet = 0; game.selectedColor = null; game.selectedNumber = null; game.selectedSize = null;
    if($("#playStatus")) $("#playStatus").innerText = "Choose Coins + Bet Option";
    saveGame();
}

/* AVIATOR REAL ANIMATED FLIGHT */
let aviatorTimer, aviatorMulti = 1.00, isFlying = false, aviatorBetAmt = 0;
window.startAviator = function() {
    aviatorBetAmt = Number($("#aviatorBet").value);
    if (!aviatorBetAmt || aviatorBetAmt > game.balance) return alert("Enter valid bet amount!");
    game.balance -= aviatorBetAmt; updateBalance(); saveGame();

    isFlying = true; aviatorMulti = 1.00;
    $("#startAviatorBtn").style.display = "none";
    $("#cashoutBtn").style.display = "block";
    
    const crashAt = (Math.random() * 3 + 1.2).toFixed(2);
    const plane = $("#aviatorPlane");

    aviatorTimer = setInterval(() => {
        aviatorMulti += 0.04;
        $("#aviatorMulti").innerText = aviatorMulti.toFixed(2) + "x";

        // Move Plane Up & Right
        if(plane) {
            let leftVal = Math.min(80, (aviatorMulti - 1) * 30 + 10);
            let bottomVal = Math.min(70, (aviatorMulti - 1) * 25 + 20);
            plane.style.left = leftVal + "%";
            plane.style.bottom = bottomVal + "%";
        }

        if (aviatorMulti >= crashAt) {
            clearInterval(aviatorTimer);
            isFlying = false;
            $("#aviatorMulti").innerText = "💥 CRASHED!";
            playSound('lose');
            if(plane) { plane.style.left = "20px"; plane.style.bottom = "20px"; }
            $("#startAviatorBtn").style.display = "block";
            $("#cashoutBtn").style.display = "none";
        }
    }, 120);
};

window.cashoutAviator = function() {
    if (!isFlying) return;
    clearInterval(aviatorTimer);
    isFlying = false;
    const winAmt = Math.floor(aviatorBetAmt * aviatorMulti);
    game.balance += winAmt;
    updateBalance(); saveGame(); playSound('win');
    if (typeof confetti === 'function') confetti();
    alert(`🎉 CASHED OUT AT ${aviatorMulti.toFixed(2)}x! Won ₹${winAmt}`);
    $("#startAviatorBtn").style.display = "block";
    $("#cashoutBtn").style.display = "none";
};

/* MINES SWEEPER WITH CASHOUT */
let mineLocations = [], minesActive = false, minesBetAmt = 0, gemsFound = 0, currentMinesWin = 0;
window.startMinesGame = function() {
    minesBetAmt = Number($("#minesBet").value);
    if (!minesBetAmt || minesBetAmt > game.balance) return alert("Enter valid bet!");
    game.balance -= minesBetAmt; updateBalance(); saveGame();
    
    minesActive = true; gemsFound = 0; currentMinesWin = 0; mineLocations = [];
    $("#minesCashoutBtn").style.display = "none";

    while (mineLocations.length < 3) {
        let r = Math.floor(Math.random() * 25);
        if (!mineLocations.includes(r)) mineLocations.push(r);
    }
    
    const grid = $("#minesGrid"); grid.innerHTML = "";
    for (let i = 0; i < 25; i++) {
        const btn = document.createElement("div");
        btn.className = "mine-card"; btn.innerText = "❓";
        btn.onclick = () => revealMine(btn, i);
        grid.appendChild(btn);
    }
};

function revealMine(el, idx) {
    if (!minesActive || el.innerText !== "❓") return;
    if (mineLocations.includes(idx)) {
        el.innerText = "💣"; el.style.background = "#ef4444";
        minesActive = false; playSound('lose'); alert("💥 BOMB! Game Over");
        $("#minesCashoutBtn").style.display = "none";
    } else {
        el.innerText = "💎"; el.style.background = "#10b981"; playSound('win');
        gemsFound++;
        let multi = (1 + (gemsFound * 0.25)).toFixed(2);
        currentMinesWin = Math.floor(minesBetAmt * multi);
        
        const btn = $("#minesCashoutBtn");
        btn.innerText = `💰 Cash Out (₹${currentMinesWin})`;
        btn.style.display = "inline-block";
    }
}

window.cashoutMines = function() {
    if (!minesActive || gemsFound === 0) return;
    minesActive = false;
    game.balance += currentMinesWin;
    updateBalance(); saveGame(); playSound('win');
    if (typeof confetti === 'function') confetti();
    alert(`🎉 CASH OUT SUCCESSFUL! Won ₹${currentMinesWin}`);
    $("#minesCashoutBtn").style.display = "none";
};

/* 3D ANIMATED DICE ROLL */
window.playDice = function(choice) {
    const bet = Number($("#diceBet").value) || 200;
    if (game.balance < bet) return alert("Low balance!");
    game.balance -= bet;

    const dice = $("#dice3D");
    dice.style.transform = "rotate(720deg) scale(1.2)";

    setTimeout(() => {
        dice.style.transform = "rotate(0deg) scale(1)";
        const roll = Math.floor(Math.random() * 6) + 1;
        const diceIcons = ["🎲", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
        dice.innerText = diceIcons[roll];

        let win = (choice === 'UNDER' && roll <= 3) || (choice === 'OVER' && roll >= 4);
        if (win) {
            game.balance += bet * 2; playSound('win');
            if (typeof confetti === 'function') confetti();
            alert(`🎉 YOU WON ₹${bet * 2}! Dice rolled ${roll}`);
        } else {
            playSound('lose');
            alert(`❌ LOST! Dice rolled ${roll}`);
        }
        updateBalance(); saveGame();
    }, 400);
};

/* 12-SLOT SPIN WHEEL CANVAS */
const wheelSlices = ["0X", "1.2X", "2X", "0.5X", "3X", "0X", "1.5X", "5X", "0X", "2X", "10X", "1.1X"];
const colors = ["#ef4444", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444", "#10b981", "#ec4899", "#ef4444", "#3b82f6", "#f59e0b", "#10b981"];

function drawWheel() {
    const canvas = document.getElementById("wheelCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const total = wheelSlices.length;
    const sliceAngle = (2 * Math.PI) / total;

    for (let i = 0; i < total; i++) {
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(110, 110);
        ctx.arc(110, 110, 110, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.fill();

        ctx.save();
        ctx.translate(110, 110);
        ctx.rotate(i * sliceAngle + sliceAngle / 2);
        ctx.fillStyle = "#FFF";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(wheelSlices[i], 55, 5);
        ctx.restore();
    }
}

let wheelDegree = 0;
window.spinWheel = function() {
    if (game.balance < 500) return alert("Need 500 coins to spin!");
    game.balance -= 500; updateBalance();

    const canvas = document.getElementById("wheelCanvas");
    const randIndex = Math.floor(Math.random() * wheelSlices.length);
    const degreesPerSlice = 360 / wheelSlices.length;
    
    wheelDegree += 1800 + (360 - (randIndex * degreesPerSlice));
    canvas.style.transform = `rotate(${wheelDegree}deg)`;

    setTimeout(() => {
        const resText = wheelSlices[randIndex];
        const multi = parseFloat(resText) || 0;
        const won = Math.floor(500 * multi);

        game.balance += won;
        updateBalance(); saveGame();

        if (multi > 1) { playSound('win'); if (typeof confetti === 'function') confetti(); alert(`🎉 WON ${won} COINS! (${resText})`); }
        else { playSound('lose'); alert(`❌ OUT! Multiplier ${resText}`); }
    }, 4000);
};

/* STRICT RESET GATE FOR VIP ONLY */
const resetBtn = $("#resetCoinsBtn");
if (resetBtn) {
    resetBtn.onclick = () => {
        playSound('win');
        if (!membershipActive()) {
            alert("🔒 Aapka Free Limit Khatam! Unlimited Coins Reset karne ke liye VIP Pass lein.");
            window.location.href = "wallet.html";
            return;
        }
        game.balance = 10000;
        updateBalance(); saveGame();
        alert("🔄 VIP Coins Reset Successful! (₹10,000 Added)");
    };
}

loadGame();
console.log("🚀 RWIN ENGINE V7 HARDWARE FINGERPRINT LOCKED");
            
