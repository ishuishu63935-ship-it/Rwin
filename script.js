"use strict";

/* ==========================================
   RWIN OFFICIAL ENGINE V3
   PART 1 - CORE ENGINE
========================================== */

console.log("🚀 RWIN Engine V3 Started");

// ---------- Helper ----------
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ---------- Game Object ----------
const game = {

    balance: 10000,

    timer: 30,

    membership: true,

    level: 1,

    xp: 0,

    selectedBet: 0,

    selectedColor: null,

    selectedNumber: null,

    selectedSize: null,

    history: []

};

// ---------- Detect Pages ----------
const isGamePage = document.getElementById("timer") !== null;
const isHomePage = document.querySelector(".home") !== null;
const isLoginPage = document.getElementById("loginBtn") !== null;

// ---------- Save ----------
function saveGame(){

    localStorage.setItem(
        "rwinGame",
        JSON.stringify(game)
    );

}

// ---------- Load ----------
function loadGame(){

    const data =
    localStorage.getItem("rwinGame");

    if(data){

        Object.assign(
            game,
            JSON.parse(data)
        );

    }

}

// ---------- Balance ----------
function updateBalance(){

    const balance1 =
    document.getElementById("balanceText");

    const balance2 =
    document.getElementById("gameBalance");

    if(balance1){

        balance1.innerText =
        "₹" + game.balance;

    }

    if(balance2){

        balance2.innerText =
        "₹" + game.balance;

    }

}

// ---------- XP ----------
function updateXP(){

    const levelText =
    document.getElementById("levelText");

    const xpFill =
    document.getElementById("xpFill");

    if(levelText){

        levelText.innerText =
        "Level " +
        game.level +
        " - Beginner";

    }

    if(xpFill){

        xpFill.style.width =
        game.xp + "%";

    }

}

// ---------- Start ----------
loadGame();

updateBalance();

updateXP();

console.log("✅ PART 1 READY");
/* ========= PART 2 - TIMER ========= */

if(isGamePage){

    const timerText = $("#timer");

    function updateTimer(){

        if(timerText){
            timerText.innerText = game.timer;
        }

    }

    updateTimer();

    setInterval(()=>{

        game.timer--;

        if(game.timer < 0){
            game.timer = 30;
        }

        updateTimer();

        if(game.timer === 0){

            finishRound();

        }

    },1000);

}
/* ========= PART 3 - BET ENGINE ========= */

if(isGamePage){

    const betStatus = $("#betStatus");

    // Bet Amount
    $$(".betBtn").forEach(btn=>{

        btn.onclick=()=>{

            $$(".betBtn").forEach(b=>{
                b.style.outline="none";
            });

            btn.style.outline="3px solid #00E5FF";

            game.selectedBet = Number(btn.innerText);

            if(betStatus){
                betStatus.innerText =
                "Selected : ₹" + game.selectedBet;
            }

        };

    });

    // Color
    $$(".colorGrid button").forEach(btn=>{

        btn.onclick=()=>{

            $$(".colorGrid button").forEach(b=>{
                b.style.outline="none";
            });

            btn.style.outline="3px solid #00E5FF";

            game.selectedColor =
            btn.innerText.trim();

        };

    });

    // Number
    document.querySelectorAll(".numberPanel .numberGrid button").forEach(btn=>{

        btn.onclick=()=>{

            document.querySelectorAll(".numberPanel .numberGrid button").forEach(b=>{
                b.style.outline="none";
            });

            btn.style.outline="3px solid yellow";

            game.selectedNumber =
            Number(btn.innerText);

        };

    });

    // BIG
    $(".bigBtn").onclick=()=>{

        game.selectedSize="BIG";

        $(".bigBtn").style.outline="3px solid #00E5FF";
        $(".smallBtn").style.outline="none";

    };

    // SMALL
    $(".smallBtn").onclick=()=>{

        game.selectedSize="SMALL";

        $(".smallBtn").style.outline="3px solid #00E5FF";
        $(".bigBtn").style.outline="none";

    };

    // Start Practice
    $("#playBtn").onclick=()=>{

        if(game.selectedBet<=0){

            $("#playStatus").innerText="❌ Select Practice Coins";
            return;

        }

        if(
            !game.selectedColor &&
            game.selectedNumber===null &&
            !game.selectedSize
        ){

            $("#playStatus").innerText="❌ Select Color / Number / BIG-SMALL";
            return;

        }

        if(game.balance<game.selectedBet){

            $("#playStatus").innerText="❌ Not Enough Coins";
            return;

        }

        game.balance-=game.selectedBet;

        updateBalance();

        saveGame();

        $("#playStatus").innerText=
        "✅ Bet Accepted";

    };

    }
