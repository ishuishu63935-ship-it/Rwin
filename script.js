    "use strict";

const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

const game = {
    balance: 0,
    history: [],
    timer: 30,
    selectedBet: 0,
    selectedColor: null
};

/* AUDIO SYNTHESIZER */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
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
}

function loadGame() {
    const data = localStorage.getItem("rwinGame") || localStorage.getItem("rwinCloud");
    if (data) {
        try { Object.assign(game, JSON.parse(data)); } catch (e) {}
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

/* TAB SWITCHER */
window.switchGame = function(gameId) {
    $$('.game-section').forEach(el => el.classList.remove('active'));
    $$('.tab-btn').forEach(el => el.classList.remove('active'));
    $(`#game-${gameId}`).classList.add('active');
    event.target.classList.add('active');
};

/* GAME 1: COLOR PREDICTION */
window.setBet = (amt) => { game.selectedBet = amt; $("#playStatus").innerText = "Selected: " + amt + " Coins"; };
window.setColor = (col) => { game.selectedColor = col; };

if ($("#playBtn")) {
    $("#playBtn").onclick = () => {
        if (!game.selectedBet || !game.selectedColor) return alert("Select Bet & Color!");
        if (game.balance < game.selectedBet) return alert("Low Balance!");
        game.balance -= game.selectedBet;
        updateBalance();
        saveGame();
        $("#playStatus").innerText = "✅ Bet Placed on " + game.selectedColor;
    };
}

/* GAME 2: AVIATOR CRASH */
let aviatorTimer, aviatorMulti = 1.00, isFlying = false, aviatorBetAmt = 0;
window.startAviator = function() {
    aviatorBetAmt = Number($("#aviatorBet").value);
    if (!aviatorBetAmt || aviatorBetAmt > game.balance) return alert("Invalid or Low Balance!");
    game.balance -= aviatorBetAmt;
    updateBalance();
    saveGame();

    isFlying = true; aviatorMulti = 1.00;
    $("#startAviatorBtn").style.display = "none";
    $("#cashoutBtn").style.display = "inline-block";
    
    const crashAt = (Math.random() * 3 + 1.2).toFixed(2);
    aviatorTimer = setInterval(() => {
        aviatorMulti += 0.05;
        $("#aviatorMulti").innerText = aviatorMulti.toFixed(2) + "x";
        if (aviatorMulti >= crashAt) {
            clearInterval(aviatorTimer);
            isFlying = false;
            $("#aviatorMulti").innerText = "💥 CRASHED!";
            playSound('lose');
            $("#startAviatorBtn").style.display = "inline-block";
            $("#cashoutBtn").style.display = "none";
        }
    }, 150);
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
    $("#startAviatorBtn").style.display = "inline-block";
    $("#cashoutBtn").style.display = "none";
};

/* GAME 3: MINES GAME */
let mineLocations = [], minesActive = false, minesBetAmt = 0;
window.startMinesGame = function() {
    minesBetAmt = Number($("#minesBet").value);
    if (!minesBetAmt || minesBetAmt > game.balance) return alert("Enter valid bet!");
    game.balance -= minesBetAmt; updateBalance(); saveGame();
    
    minesActive = true; mineLocations = [];
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
    } else {
        el.innerText = "💎"; el.style.background = "#10b981"; playSound('win');
        game.balance += Math.floor(minesBetAmt * 1.3);
        updateBalance(); saveGame();
    }
}

/* GAME 4: DICE ROLL */
window.playDice = function(choice) {
    const bet = 200;
    if (game.balance < bet) return alert("Need 200 coins!");
    game.balance -= bet;
    const roll = Math.floor(Math.random() * 6) + 1;
    $("#diceResult").innerText = "🎲 " + roll;
    
    let win = (choice === 'UNDER' && roll < 4) || (choice === 'OVER' && roll >= 4);
    if (win) {
        game.balance += bet * 2; playSound('win'); alert("🎉 YOU WON 400 COINS!");
    } else {
        playSound('lose');
    }
    updateBalance(); saveGame();
};

/* GAME 5: SPIN WHEEL */
window.spinWheel = function() {
    if (game.balance < 500) return alert("Need 500 coins to spin!");
    game.balance -= 500; updateBalance();
    
    const multis = [0, 1.5, 2, 0.5, 3, 5];
    const res = multis[Math.floor(Math.random() * multis.length)];
    
    $("#wheelDisplay").innerText = "🎰 Spinning...";
    setTimeout(() => {
        $("#wheelDisplay").innerText = "🎯 " + res + "X";
        const won = Math.floor(500 * res);
        game.balance += won;
        updateBalance(); saveGame();
        if (res >= 1.5) playSound('win'); else playSound('lose');
    }, 1000);
};

/* RESET BUTTON */
$("#resetCoinsBtn").onclick = () => {
    game.balance = 10000; updateBalance(); saveGame(); alert("🔄 Reset to 10,000 Coins!");
};

loadGame();
        
