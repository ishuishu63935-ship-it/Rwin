"use strict";

/* ==========================================
        RWIN OFFICIAL ENGINE V4
========================================== */

console.log("🚀 RWIN Engine V4 Started");

/* ==========================================
        HELPERS
========================================== */

const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);

/* ==========================================
        GAME DATA
========================================== */

const game = {

    balance:10000,

    xp:0,

    level:1,

    membership:false,

    membershipPlan:"Free",

    membershipExpiry:null,

    history:[],

    timer:30,

    selectedBet:0,

    selectedColor:null,

    selectedNumber:null,

    selectedSize:null

};

/* ==========================================
        PAGE DETECT
========================================== */

const isGamePage =
document.getElementById("timer")!==null;

const isLoginPage =
document.getElementById("loginBtn")!==null;

const isMembershipPage =
document.getElementById("membershipStatus")!==null;

/* ==========================================
        LOAD LOCAL
========================================== */

function loadGame(){

    const data =
    localStorage.getItem("rwinGame");

    if(!data) return;

    Object.assign(
        game,
        JSON.parse(data)
    );

}

/* ==========================================
        LOAD CLOUD
========================================== */

function loadCloud(){

    const data =
    localStorage.getItem("rwinCloud");

    if(!data) return;

    Object.assign(
        game,
        JSON.parse(data)
    );

}

/* ==========================================
        SAVE
========================================== */

function saveGame(){

    localStorage.setItem(

        "rwinGame",

        JSON.stringify(game)

    );

    localStorage.setItem(

        "rwinCloud",

        JSON.stringify(game)

    );

}

/* ==========================================
        BALANCE
========================================== */

function updateBalance(){

    const a =
    document.getElementById("balanceText");

    const b =
    document.getElementById("gameBalance");

    if(a){

        a.innerText="₹"+game.balance;

    }

    if(b){

        b.innerText="₹"+game.balance;

    }

}

/* ==========================================
        XP
========================================== */

function updateXP(){

    const level =
    document.getElementById("levelText");

    const fill =
    document.getElementById("xpFill");

    if(level){

        level.innerText=
        "Level "+game.level;

    }

    if(fill){

        fill.style.width=
        game.xp+"%";

    }

}

/* ==========================================
        MEMBERSHIP
========================================== */

function updateMembership(){

    const box =
    document.getElementById("membershipStatus");

    if(!box) return;

    if(game.membership){

        box.innerHTML=
        "👑 "+game.membershipPlan;

    }else{

        box.innerHTML=
        "🆓 Free Plan";

    }

}

/* ==========================================
        START
========================================== */

loadGame();

loadCloud();

updateBalance();

updateXP();

updateMembership();

console.log("✅ PART 1 COMPLETE");
/* ==========================================
        TIMER ENGINE
========================================== */

if (isGamePage) {

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

if (isGamePage) {

    const playBtn = $("#playBtn");

    const playStatus = $("#playStatus");

    // Bet Amount
    $$(".betBtn").forEach(btn => {

        btn.onclick = () => {

            $$(".betBtn").forEach(b => {

                b.style.outline = "none";

            });

            btn.style.outline = "3px solid #00E5FF";

            game.selectedBet = Number(btn.innerText);

        };

    });

    // Color
    $$(".colorGrid button").forEach(btn => {

        btn.onclick = () => {

            $$(".colorGrid button").forEach(b => {

                b.style.outline = "none";

            });

            btn.style.outline = "3px solid #00E5FF";

            game.selectedColor = btn.innerText.trim();

        };

    });

    // Number
    document.querySelectorAll(".numberPanel .numberGrid button").forEach(btn => {

        btn.onclick = () => {

            document.querySelectorAll(".numberPanel .numberGrid button").forEach(b => {

                b.style.outline = "none";

            });

            btn.style.outline = "3px solid yellow";

            game.selectedNumber = Number(btn.innerText);

        };

    });

    // BIG
    const bigBtn = $(".bigBtn");

    if (bigBtn) {

        bigBtn.onclick = () => {

            game.selectedSize = "BIG";

        };

    }

    // SMALL
    const smallBtn = $(".smallBtn");

    if (smallBtn) {

        smallBtn.onclick = () => {

            game.selectedSize = "SMALL";

        };

    }

    // PLAY
    if (playBtn) {

        playBtn.onclick = () => {

            if (game.selectedBet <= 0) {

                playStatus.innerText =
                "❌ Select Coins";

                return;

            }

            if (
                !game.selectedColor &&
                game.selectedNumber === null &&
                !game.selectedSize
            ) {

                playStatus.innerText =
                "❌ Select Bet";

                return;

            }

            if (game.balance < game.selectedBet) {

                playStatus.innerText =
                "❌ Not Enough Coins";

                return;

            }

            game.balance -= game.selectedBet;

            updateBalance();

            saveGame();

            playStatus.innerText =
            "✅ Bet Accepted";

        };

    }

}

console.log("✅ PART 2 COMPLETE");
