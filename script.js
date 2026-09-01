
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
window.game = {
    balance: 10000,
    xp: 0,
    level: 1,
    membership: false,
    membershipPlan: "Free Plan",
    timer: 30,
    selectedBet: 100,
    selectedColor: null,
    selectedNumber: null,
    selectedSize: null,
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

/* ============================================================
   CUSTOM CASINO WIN/LOSE POPUP MODAL (NO BROWSER ALERTS)
   ============================================================ */
let modalAutoCloseTimer = null;

window.showCasinoModal = function(isWin, title, amountText, icon = "🏆", tags = null) {
    const modal = document.getElementById("resultModal");
    const card = document.getElementById("resultCard");
    const badge = document.getElementById("modalBadge");
    const titleEl = document.getElementById("modalTitle");
    const amtEl = document.getElementById("modalAmount");
    const tagsRow = document.getElementById("modalTags");
    const timerEl = document.getElementById("closeTimer");

    if (!modal) {
        return;
    }

    if (isWin) {
        card.className = "result-card";
        badge.innerText = icon;
        titleEl.innerText = title || "Congratulations!";
        amtEl.innerText = "+" + amountText;
        playSound('win');
        if (typeof confetti === 'function') confetti();
    } else {
        card.className = "result-card loss";
        badge.innerText = icon !== "🏆" ? icon : "💥";
        titleEl.innerText = title || "Better Luck Next Time";
        amtEl.innerText = amountText.startsWith("-") || amountText === "0" ? amountText : "-" + amountText;
        playSound('lose');
    }

    if (tags) {
        tagsRow.style.display = "flex";
        if (document.getElementById("tagColor")) {
            document.getElementById("tagColor").innerText = tags.color || "";
            document.getElementById("tagColor").className = "res-tag " + (tags.color ? tags.color.toLowerCase() : "");
        }
        if (document.getElementById("tagNum")) document.getElementById("tagNum").innerText = tags.number !== undefined ? tags.number : "";
        if (document.getElementById("tagSize")) document.getElementById("tagSize").innerText = tags.size || "";
    } else {
        tagsRow.style.display = "none";
    }

    modal.classList.add("active");

    let leftSec = 3;
    if (timerEl) timerEl.innerText = leftSec;

    if (modalAutoCloseTimer) clearInterval(modalAutoCloseTimer);
    modalAutoCloseTimer = setInterval(() => {
        leftSec--;
        if (timerEl) timerEl.innerText = leftSec;
        if (leftSec <= 0) {
            closeResultModal();
        }
    }, 1000);
};

window.closeResultModal = function() {
    const modal = document.getElementById("resultModal");
    if (modal) modal.classList.remove("active");
    if (modalAutoCloseTimer) clearInterval(modalAutoCloseTimer);
};

/* XP & LEVEL ENGINE WITH SYNC */
window.addXP = function(amount) {
    game.xp += amount;
    const targetXP = game.level * 500;
    if (game.xp >= targetXP) {
        game.level++;
        showCasinoModal(true, `Level Up! Level ${game.level}`, "New Tier Unlocked", "👑");
    }
    updateLevelUI();
    saveGame();
};

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

/* CLOUD LOAD & LOCAL STORAGE SYNC */
async function loadGame() {
    const local = localStorage.getItem("rwinGame");
    if (local) {
        try { Object.assign(game, JSON.parse(local)); } catch(e){}
    }

    const hwId = getOrCreateDeviceId();
    const deviceRef = doc(db, "devices", hwId);

    try {
        const deviceSnap = await getDoc(deviceRef);
        if (deviceSnap.exists()) {
            const devData = deviceSnap.data();
            game.balance = devData.balance !== undefined ? devData.balance : game.balance;
            game.xp = devData.xp || game.xp;
            game.level = devData.level || game.level;
            game.membership = devData.membership || game.membership;
            game.membershipPlan = devData.membershipPlan || game.membershipPlan;
        } else {
            await setDoc(deviceRef, { 
                deviceId: hwId, 
                balance: game.balance, 
                xp: game.xp, 
                level: game.level, 
                membership: game.membership, 
                membershipPlan: game.membershipPlan 
            });
        }
    } catch (e) {
        console.log("Firebase Load Fallback to LocalStorage");
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
        await setDoc(deviceRef, { 
            deviceId: hwId, 
            balance: game.balance, 
            xp: game.xp, 
            level: game.level, 
            membership: game.membership,
            membershipPlan: game.membershipPlan 
        }, { merge: true });
    }
}

function saveLocal() {
    localStorage.setItem("rwinGame", JSON.stringify(game));
}

window.updateBalance = function() {
    const b = document.getElementById("balanceText");
    if (b) b.innerText = "₹" + game.balance.toLocaleString();
};

/* ============================================================
   COLOR PREDICTION ENGINE (TIMER + NUMBER + COLOR + BIG/SMALL)
   ============================================================ */
function initColorPrediction() {
    if (!$("#timer")) return;
    setInterval(() => {
        game.timer--;
        if ($("#timer")) $("#timer").innerText = game.timer;
        if (game.timer <= 0) {
            game.timer = 30;
            resolveColorRound();
        }
    }, 1000);
}

window.setBet = (amt) => { 
    game.selectedBet = amt; 
    if($("#playStatus")) $("#playStatus").innerText = "Selected Bet Coins: ₹" + amt; 
};

window.setColor = (col) => { 
    game.selectedColor = col; 
    game.selectedNumber = null;
    game.selectedSize = null;
    if($("#playStatus")) $("#playStatus").innerText = "Betting on Color " + col + " (₹" + game.selectedBet + ")";
};

window.setNumber = (num) => {
    game.selectedNumber = num;
    game.selectedColor = null;
    game.selectedSize = null;
    if($("#playStatus")) $("#playStatus").innerText = "Betting on Number " + num + " (₹" + game.selectedBet + ")";
};

window.setSize = (size) => {
    game.selectedSize = size;
    game.selectedColor = null;
    game.selectedNumber = null;
    if($("#playStatus")) $("#playStatus").innerText = "Betting on " + size + " (₹" + game.selectedBet + ")";
};

function resolveColorRound() {
    if (!game.selectedColor && game.selectedNumber === null && !game.selectedSize) return;
    if (game.balance < game.selectedBet) {
        showCasinoModal(false, "Low Balance", "0", "⚠️");
        return;
    }

    game.balance -= game.selectedBet;
    
    const resultNum = Math.floor(Math.random() * 10);
    let resultColor = "GREEN";
    if ([1, 3, 7, 9].includes(resultNum)) resultColor = "GREEN";
    else if ([2, 4, 6, 8].includes(resultNum)) resultColor = "RED";
    else if ([0, 5].includes(resultNum)) resultColor = "VIOLET";

    const resultSize = resultNum >= 5 ? "BIG" : "SMALL";

    let isWin = false;
    let winMultiplier = 2.0;

    if (game.selectedColor && game.selectedColor === resultColor) {
        isWin = true;
        winMultiplier = resultColor === "VIOLET" ? 4.5 : 2.0;
    } else if (game.selectedNumber !== null && game.selectedNumber === resultNum) {
        isWin = true;
        winMultiplier = 9.0;
    } else if (game.selectedSize && game.selectedSize === resultSize) {
        isWin = true;
        winMultiplier = 2.0;
    }

    if (isWin) {
        const won = Math.floor(game.selectedBet * winMultiplier);
        game.balance += won;
        addXP(90);
        showCasinoModal(true, "Winning Bonus!", "₹" + won, "🎨", {
            color: resultColor,
            number: resultNum,
            size: resultSize
        });
    } else {
        showCasinoModal(false, "Round Result", "₹" + game.selectedBet, "💥", {
            color: resultColor,
            number: resultNum,
            size: resultSize
        });
    }

    game.selectedColor = null;
    game.selectedNumber = null;
    game.selectedSize = null;
    updateBalance();
    saveGame();
}

/* AVIATOR GAME */
let aviatorTimer, aviatorMulti = 1.00, isFlying = false, aviatorBetAmt = 0;
window.startAviator = function() {
    aviatorBetAmt = Number($("#aviatorBet").value);
    if (!aviatorBetAmt || aviatorBetAmt > game.balance) {
        showCasinoModal(false, "Invalid Bet", "0", "⚠️");
        return;
    }
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
            showCasinoModal(false, "Plane Crashed!", "₹" + aviatorBetAmt, "🚀");
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
    updateBalance(); saveGame();
    showCasinoModal(true, "Flight Cashed Out!", "₹" + winAmt, "✈️");
    $("#startAviatorBtn").style.display = "block";
    $("#cashoutBtn").style.display = "none";
};

/* MINES GAME */
let mineLocations = [], minesActive = false, minesBetAmt = 0, gemsFound = 0, currentMinesWin = 0;
window.startMinesGame = function() {
    minesBetAmt = Number($("#minesBet").value);
    if (!minesBetAmt || minesBetAmt > game.balance) {
        showCasinoModal(false, "Invalid Bet", "0", "⚠️");
        return;
    }
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
        minesActive = false;
        showCasinoModal(false, "Bomb Hit!", "₹" + minesBetAmt, "💣");
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
    updateBalance(); saveGame();
    showCasinoModal(true, "Mines Vault Cashed Out!", "₹" + currentMinesWin, "💎");
    $("#minesCashoutBtn").style.display = "none";
};

/* HI-LO CARDS */
window.playHiLo = function(choice) {
    const bet = Number($("#hiloBet").value) || 200;
    if (game.balance < bet) {
        showCasinoModal(false, "Low Balance", "0", "⚠️");
        return;
    }
    game.balance -= bet;

    const nextCard = Math.floor(Math.random() * 12) + 1;
    let win = false;
    if (choice === 'HIGHER' && nextCard >= game.currentCard) win = true;
    if (choice === 'LOWER' && nextCard <= game.currentCard) win = true;

    $("#currentCardDisplay").innerText = nextCard;

    if (win) {
        const won = bet * 2;
        game.balance += won; addXP(60);
        showCasinoModal(true, "Card Win!", "₹" + won, "🃏");
    } else {
        showCasinoModal(false, "Card Lost", "₹" + bet, "🃏");
    }

    game.currentCard = nextCard;
    updateBalance(); saveGame();
};

/* CYBER SLOTS */
const slotIcons = ["💎", "7️⃣", "🎰", "🔥", "👑", "🍒"];
window.spinSlots = function() {
    if (game.balance < 500) {
        showCasinoModal(false, "Need 500 Coins", "0", "🎰");
        return;
    }
    game.balance -= 500; updateBalance(); addXP(75);

    const r1 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
    const r2 = slotIcons[Math.floor(Math.random() * slotIcons.length)];
    const r3 = slotIcons[Math.floor(Math.random() * slotIcons.length)];

    $("#reel1").innerText = r1;
    $("#reel2").innerText = r2;
    $("#reel3").innerText = r3;

    if (r1 === r2 && r2 === r3) {
        game.balance += 5000;
        showCasinoModal(true, "TRIPLE JACKPOT!", "₹5,000", "🎰");
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        game.balance += 1000;
        showCasinoModal(true, "DOUBLE MATCH!", "₹1,000", "🎰");
    } else {
        showCasinoModal(false, "Slots Spin Lost", "₹500", "🎰");
    }
    updateBalance(); saveGame();
};

/* ============================================================
   MEMBERSHIP LOCK & GATEKEEPER ENGINE
   ============================================================ */
let currentLoadedModule = null;

window.checkAndOpenGame = function(gameId, title, reqLevel, isSuperVipOnly = false) {
    const plan = game.membershipPlan || "Free Plan";
    const isSuperVip = plan === "SUPER_VIP_200";
    const hasBasicPass = game.membership === true || (plan !== "Free Plan");

    // Tier 1 Check: ₹200 Super VIP Pass Games Lock
    if (isSuperVipOnly && !isSuperVip) {
        showCasinoModal(false, "Super VIP Required", "0", "🔒");
        setTimeout(() => {
            window.location.href = "wallet.html";
        }, 1500);
        return;
    }

    // Tier 2 Check: ₹9/49/99 Pass allows Level 1 to 20 unlock progression
    if (!isSuperVip && !hasBasicPass && game.level < reqLevel) {
        showCasinoModal(false, `Locked - Level ${reqLevel} Needed`, "0", "🔒");
        return;
    }

    if (typeof window.openGame === "function") {
        window.openGame(gameId, title);
    }
    loadGameModule(gameId);
};

function loadGameModule(gameId) {
    if (currentLoadedModule) {
        currentLoadedModule.remove();
        currentLoadedModule = null;
    }

    const script = document.createElement("script");
    script.src = `games/${gameId}.js`;
    script.id = `module-${gameId}`;
    document.body.appendChild(script);
    currentLoadedModule = script;
}

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    initColorPrediction();

    /* STRICT MEMBERSHIP LOCK FOR RESET COINS */
    const resetBtn = $("#resetCoinsBtn");
    if (resetBtn) {
        resetBtn.onclick = () => {
            const hasActiveMembership = game.membership === true || (game.membershipPlan && game.membershipPlan !== "Free Plan");

            if (!hasActiveMembership) {
                showCasinoModal(false, "Membership Locked", "0", "🔒");
                setTimeout(() => {
                    window.location.href = "wallet.html";
                }, 1500);
                return;
            }

            game.balance = 10000;
            updateBalance(); 
            saveGame();
            showCasinoModal(true, "VIP Coins Reset!", "₹10,000", "🔄");
        };
    }
});
                        
