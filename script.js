import { db } from "./firebase.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

/* HARDWARE FINGERPRINT ENGINE */
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

/* GLOBAL GAME STATE */
const game = {
    balance: 10000,
    xp: 0,
    level: 1,
    membership: false, // Default Free
    membershipPlan: "Free",
    membershipExpiry: null,
    timer: 30,
    selectedBet: 0,
    selectedColor: null,
    currentCard: 7
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
            osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start(); osc.stop(audioCtx.currentTime + 0.25);
        } else if (type === 'lose') {
            osc.frequency.setValueAtTime(250, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
            osc.start(); osc.stop(audioCtx.currentTime + 0.25);
        }
    } catch(e) {}
}

/* XP & LEVEL ENGINE WITH SYNC */
function addXP(amount) {
    game.xp += amount;
    const targetXP = game.level * 500;
    if (game.xp >= targetXP) {
        game.level++;
        playSound('win');
        if (typeof confetti === 'function') confetti();
        alert(`🎉 LEVEL UP! You reached Level ${game.level}! New Games Unlocked!`);
    }
    updateLevelUI();
    saveGame();
}

function updateLevelUI() {
    const badge = $("#userLevelBadge");
    const xpTxt = $("#xpText");
    const bar = $("#xpBar");
    const targetXP = game.level * 500;
    const progress = Math.min(100, (game.xp / targetXP) * 100);

    if (badge) badge.innerText = `LVL ${game.level}`;
    if (xpTxt) xpTxt.innerText = `${game.xp} / ${targetXP} XP`;
    if (bar) bar.style.width = `${progress}%`;
}

/* CLOUD LOAD & STRICT HARDWARE LOCK */
async function loadGame() {
    const hwId = getOrCreateDeviceId();
    const deviceRef = doc(db, "devices", hwId);

    try {
        const deviceSnap = await getDoc(deviceRef);
        if (deviceSnap.exists()) {
            const devData = deviceSnap.data();
            game.balance = devData.balance !== undefined ? devData.balance : 10000;
            game.xp = devData.xp || 0;
            game.level = devData.level || 1;
            game.membership = devData.membership || false;
            game.membershipPlan = devData.membershipPlan || "Free";
        } else {
            game.balance = 10000;
            await setDoc(deviceRef, { deviceId: hwId, balance: 10000, xp: 0, level: 1, membership: false, membershipPlan: "Free" });
        }
    } catch (e) {
        const local = localStorage.getItem("rwinGame");
        if (local) try { Object.assign(game, JSON.parse(local)); } catch(err){}
    }

    updateBalance();
    updateLevelUI();
    saveLocal();
}

async function saveGame() {
    saveLocal();
    const hwId = getOrCreateDeviceId();
    const deviceRef = doc(db, "devices", hwId);

    try {
        await updateDoc(deviceRef, {
            balance: game.balance,
            xp: game.xp,
            level: game.level,
            membership: game.membership,
            membershipPlan: game.membershipPlan,
            lastUpdated: new Date().toISOString()
        });
    } catch (e) {
        await setDoc(deviceRef, { deviceId: hwId, balance: game.balance, xp: game.xp, level: game.level, membership: game.membership }, { merge: true });
    }
}

function saveLocal() {
    localStorage.setItem("rwinGame", JSON.stringify(game));
}

function updateBalance() {
    const b = document.getElementById("balanceText");
    if (b) b.innerText = "₹" + game.balance.toLocaleString();
}

/* REALTIME TICKER */
const tickerUsers = ["ProGamer_91", "Priya_VIP", "Aman_Bhai", "Karan_RWIN", "Rohan_xX"];
const tickerGames = ["Aviator Crash", "Cyber Mines", "Hi-Lo Cards", "Cyber Slots"];
setInterval(() => {
    const user = tickerUsers[Math.floor(Math.random() * tickerUsers.length)];
    const gName = tickerGames[Math.floor(Math.random() * tickerGames.length)];
    const amt = (Math.floor(Math.random() * 45) + 5) * 100;
    const tickerEl = $("#liveTickerText");
    if (tickerEl) tickerEl.innerText = `⚡ ${user} won ₹${amt.toLocaleString()} on ${gName}!`;
}, 4000);

/* AVIATOR GAME */
let aviatorTimer, aviatorMulti = 1.00, isFlying = false, aviatorBetAmt = 0;
window.startAviator = function() {
    aviatorBetAmt = Number($("#aviatorBet").value);
    if (!aviatorBetAmt || aviatorBetAmt > game.balance) return alert("Enter valid bet amount!");
    game.balance -= aviatorBetAmt; updateBalance(); addXP(50);

    isFlying = true; aviatorMulti = 1.00;
    $("#startAviatorBtn").style.display = "none";
    $("#cashoutBtn").style.display = "block";
    
    const crashAt = (Math.random() * 3.5 + 1.1).toFixed(2);
    const plane = $("#aviatorPlane");

    aviatorTimer = setInterval(() => {
        aviatorMulti += 0.05;
        $("#aviatorMulti").innerText = aviatorMulti.toFixed(2) + "x";

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
    }, 110);
};

window.cashoutAviator = function() {
    if (!isFlying) return;
    clearInterval(aviatorTimer);
    isFlying = false;
    const winAmt = Math.floor(aviatorBetAmt * aviatorMulti);
    game.balance += winAmt; addXP(100);
    updateBalance(); saveGame(); playSound('win');
    if (typeof confetti === 'function') confetti();
    alert(`🎉 CASHED OUT AT ${aviatorMulti.toFixed(2)}x! Won ₹${winAmt}`);
    $("#startAviatorBtn").style.display = "block";
    $("#cashoutBtn").style.display = "none";
};

/* MINES GAME */
let mineLocations = [], minesActive = false, minesBetAmt = 0, gemsFound = 0, currentMinesWin = 0;
window.startMinesGame = function() {
    minesBetAmt = Number($("#minesBet").value);
    if (!minesBetAmt || minesBetAmt > game.balance) return alert("Enter valid bet!");
    game.balance -= minesBetAmt; updateBalance(); addXP(40);
    
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
        let multi = (1 + (gemsFound * 0.3)).toFixed(2);
        currentMinesWin = Math.floor(minesBetAmt * multi);
        
        const btn = $("#minesCashoutBtn");
        btn.innerText = `💰 Cash Out (₹${currentMinesWin})`;
        btn.style.display = "inline-block";
    }
}

window.cashoutMines = function() {
    if (!minesActive || gemsFound === 0) return;
    minesActive = false;
    game.balance += currentMinesWin; addXP(80);
    updateBalance(); saveGame(); playSound('win');
    if (typeof confetti === 'function') confetti();
    alert(`🎉 CASH OUT SUCCESSFUL! Won ₹${currentMinesWin}`);
    $("#minesCashoutBtn").style.display = "none";
};

/* HI-LO CARDS */
window.playHiLo = function(choice) {
    const bet = Number($("#hiloBet").value) || 200;
    if (game.balance < bet) return alert("Low balance!");
    game.balance -= bet;

    const nextCard = Math.floor(Math.random() * 12) + 1;
    let win = false;
    if (choice === 'HIGHER' && nextCard >= game.currentCard) win = true;
    if (choice === 'LOWER' && nextCard <= game.currentCard) win = true;

    $("#currentCardDisplay").innerText = nextCard;

    if (win) {
        game.balance += bet * 2; addXP(60); playSound('win');
        if (typeof confetti === 'function') confetti();
        alert(`🎉 WON ₹${bet * 2}! Next Card was ${nextCard}`);
    } else {
        playSound('lose');
        alert(`❌ LOST! Next Card was ${nextCard}`);
    }

    game.currentCard = nextCard;
    updateBalance(); saveGame();
};

/* CYBER SLOTS */
const slotIcons = ["💎", "7️⃣", "🎰", "🔥", "👑", "🍒"];
window.spinSlots = function() {
    if (game.balance < 500) return alert("Need 500 coins to spin!");
    game.balance -= 500; updateBalance(); addXP(75);

    const r1 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
    const r2 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
    const r3 = slotIcons[Math.floor(Math.random() * slotIcons.length)];

    $("#reel1").innerText = r1;
    $("#reel2").innerText = r2;
    $("#reel3").innerText = r3;

    if (r1 === r2 && r2 === r3) {
        game.balance += 5000; playSound('win'); if (typeof confetti === 'function') confetti();
        alert("🎉 TRIPLE JACKPOT! Won ₹5,000 Coins!");
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        game.balance += 1000; playSound('win');
        alert("🎉 DOUBLE MATCH! Won ₹1,000 Coins!");
    } else {
        playSound('lose');
    }
    updateBalance(); saveGame();
};

/* COLOR PREDICTION BETS */
window.setBet = (amt) => { game.selectedBet = amt; if($("#playStatus")) $("#playStatus").innerText = "Coins Selected: " + amt; };
window.setColor = (col) => { game.selectedColor = col; };

/* LEVEL & MEMBERSHIP GATEKEEPER FOR GAME OPENING */
window.checkAndOpenGame = function(gameId, title, reqLevel) {
    if (game.membershipPlan === "SUPER_VIP_200" || game.level >= reqLevel) {
        openGame(gameId, title);
    } else {
        playSound('lose');
        alert(`🔒 LOCKED! Reach Level ${reqLevel} OR Upgrade to ₹200 Super VIP Pass to Instant Unlock!`);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    
    /* 🔒 STRICT COIN RESET LOCK */
    const resetBtn = $("#resetCoinsBtn");
    if (resetBtn) {
        resetBtn.onclick = () => {
            if (!game.membership || game.membership === false || game.membershipPlan === "Free") {
                playSound('lose');
                alert("🔒 Free limit over! Unlimited Coins Reset karne ke liye VIP Pass lein.");
                window.location.href = "wallet.html";
                return;
            }
            playSound('win');
            game.balance = 10000;
            updateBalance(); saveGame();
            alert("🔄 VIP Coins Reset Successful! (₹10,000 Added)");
        };
    }
});

/* DYNAMIC MODULE LOADER & GATEKEEPER */
let currentLoadedModule = null;

window.checkAndOpenGame = function(gameId, title, reqLevel, isSuperVipOnly = false) {
    const isSuperVip = game.membershipPlan === "SUPER_VIP_200";

    // Tier 1 Check: 50+ Super VIP Exclusive Games Lock
    if (isSuperVipOnly && !isSuperVip) {
        playSound('lose');
        alert("🔒 SUPER VIP ONLY! ₹200 Pass se saare 50+ Exclusive Games unlock karein.");
        window.location.href = "wallet.html";
        return;
    }

    // Tier 2 Check: Level Lock for Basic Games (LVL 1 to 20)
    if (!isSuperVip && game.level < reqLevel) {
        playSound('lose');
        alert(`🔒 LOCKED! Reach Level ${reqLevel} OR Upgrade to ₹200 Super VIP Pass to Instant Unlock!`);
        return;
    }

    openGame(gameId, title);
    loadGameModule(gameId);
};

function loadGameModule(gameId) {
    // Memory Clean-up to prevent browser crash
    if (currentLoadedModule) {
        currentLoadedModule.remove();
        currentLoadedModule = null;
    }

    // Load module script on-demand
    const script = document.createElement("script");
    script.src = `games/${gameId}.js`;
    script.id = `module-${gameId}`;
    document.body.appendChild(script);
    currentLoadedModule = script;
}
