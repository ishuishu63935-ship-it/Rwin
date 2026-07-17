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
function loadCloudGame(){

    const cloud =
    localStorage.getItem("rwinCloud");

    if(!cloud) return;

    const data =
    JSON.parse(cloud);

    game.balance =
    data.balance || 10000;

    game.level =
    data.level || 1;

    game.xp =
    data.xp || 0;

    game.membership =
    data.membership || false;

    game.history =
    data.history || [];

}
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

    localStorage.setItem(
        "rwinCloud",
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
loadCloudGame();
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
/* ========= PART 4 - RESULT ENGINE ========= */

function generateResult(){

    const number = Math.floor(Math.random() * 10);

    let color = "";

    if(number===0 || number===5){

        color="VIOLET";

    }else if(number%2===0){

        color="RED";

    }else{

        color="GREEN";

    }

    const size = number>=5 ? "BIG" : "SMALL";

    return{

        number,
        color,
        size

    };

}

function finishRound(){

    const result = generateResult();

    let win = false;

    if(game.selectedColor===result.color){
        win=true;
    }

    if(game.selectedNumber===result.number){
        win=true;
    }

    if(game.selectedSize===result.size){
        win=true;
    }

    if(win){

        game.balance += game.selectedBet * 2;

        $("#statusText").innerText="🎉 WIN";

        game.xp += 10;

    }else{

        $("#statusText").innerText="❌ LOSE";

        if(game.xp>0){
            game.xp -= 2;
        }

    }

    $("#resultText").innerText =
    result.number + " | " +
    result.color + " | " +
    result.size;

    updateBalance();

    updateXP();
   
updateRecentActivity(result);
   
   checkLevelUp();
   
    saveGame();
   
clearSelection();
}
/* ========= PART 5 - HISTORY ========= */

function updateRecentActivity(result){

    game.history.unshift({

        number: result.number,

        color: result.color,

        size: result.size

    });

    if(game.history.length > 10){

        game.history.pop();

    }

    const recent = $("#recentCard");

    if(!recent) return;

    recent.innerHTML = "";

    game.history.forEach(item=>{

        recent.innerHTML += `
        <p>
        🎯 ${item.number}
        | ${item.color}
        | ${item.size}
        </p>
        `;

    });

    saveGame();

}

function loadHistory(){

    const recent = $("#recentCard");

    if(!recent) return;

    if(game.history.length===0){

        recent.innerHTML="<p>No Practice Yet.</p>";

        return;

    }

    recent.innerHTML="";

    game.history.forEach(item=>{

        recent.innerHTML += `
        <p>
        🎯 ${item.number}
        | ${item.color}
        | ${item.size}
        </p>
        `;

    });

}

loadHistory();
/* ========= PART 6 - MEMBERSHIP ========= */

// Reset Coins

const resetBtn = $("#resetCoinsBtn");

if(resetBtn){

    resetBtn.onclick=()=>{

        if(!game.membership){

            alert("Membership Expired");

            return;

        }

        game.balance = 10000;

        updateBalance();

        saveGame();

        $("#statusText").innerText =
        "♻ Coins Reset Successful";

    };

}

// XP Level System

function checkLevelUp(){

    while(game.xp >= 100){

        game.xp -= 100;

        game.level++;

    }

    updateXP();

}

// Membership Status

function membershipActive(){

    return game.membership === true;

}
/* ========= PART 7 - AUTO SAVE ========= */

// Auto Save Every 5 Seconds

setInterval(()=>{

    saveGame();

},5000);

// Restore UI

function restoreGame(){

    updateBalance();

    updateXP();

    loadHistory();

}

restoreGame();

// Clear Selection

function clearSelection(){

    game.selectedBet = 0;

    game.selectedColor = null;

    game.selectedNumber = null;

    game.selectedSize = null;

    $("#playStatus").innerText =
    "Choose Coins + Color / Number / BIG-SMALL";

    $$(".betBtn").forEach(btn=>{
        btn.style.outline="none";
    });

    $$(".colorGrid button").forEach(btn=>{
        btn.style.outline="none";
    });

    document.querySelectorAll(".numberPanel .numberGrid button").forEach(btn=>{
        btn.style.outline="none";
    });

    if($(".bigBtn")){
        $(".bigBtn").style.outline="none";
    }

    if($(".smallBtn")){
        $(".smallBtn").style.outline="none";
    }

           }
