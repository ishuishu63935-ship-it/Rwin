"use strict";
"use strict";

alert("RWIN Script Loaded");
console.log("RWIN Script Loaded");
/* ===================================
   RWIN OFFICIAL ENGINE V2
   Part 1 - Core Engine
=================================== */

// ---------- Helpers ----------
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ---------- Game Data ----------
const game = {

    balance: 10000,

    timer: 30,

    level: 1,

    xp: 0,

    membership: true,

    selectedBet: 0,

    selectedColor: null,

    selectedNumber: null,

    selectedSize: null,

    history: []

};

// ---------- Page Detection ----------

const isLoginPage = $("#loginBtn");

const isHomePage = $(".container");

const isGamePage = $("#timer");

// ---------- Local Storage ----------

function saveGame(){

    localStorage.setItem("rwinGame", JSON.stringify(game));

}

function loadGame(){

    const data = localStorage.getItem("rwinGame");

    if(data){

        Object.assign(game, JSON.parse(data));

    }

}

loadGame();

// ---------- Balance ----------

function updateBalance(){

    const balance = $("#balanceText");

    if(balance){

        balance.innerText = "₹" + game.balance;

    }

}

// ---------- Membership ----------

function resetPracticeCoins(){

    if(!game.membership){

        alert("Membership Expired");

        return;

    }

    game.balance = 10000;

    updateBalance();

    saveGame();

}

// ---------- Start ----------

updateBalance();

console.log("✅ RWIN Engine V2 Loaded");
/* ===================================
   RWIN OFFICIAL ENGINE V2
   Part 2 - Timer & Selection
=================================== */

if(isGamePage){

    // -------- Timer --------

    const timerText = $("#timer");

    setInterval(()=>{

        game.timer--;

        if(game.timer < 0){

            game.timer = 30;

        }

        if(timerText){

            timerText.innerText = game.timer;

        }

    },1000);

    // -------- Bet Buttons --------

    const betStatus = $("#betStatus");

    $$(".betBtn").forEach(btn=>{

        btn.addEventListener("click",()=>{

            $$(".betBtn").forEach(b=>{

                b.style.outline="none";

            });

            btn.style.outline="3px solid #00E5FF";

            game.selectedBet = Number(btn.innerText);

            if(betStatus){

                betStatus.innerText =
                "Selected : ₹" + game.selectedBet;

            }

        });

    });

    // -------- Color --------

    $$(".colorGrid button").forEach(btn=>{

        btn.addEventListener("click",()=>{

            $$(".colorGrid button").forEach(b=>{

                b.style.outline="none";

            });

            btn.style.outline="3px solid #00E5FF";

            game.selectedColor =
            btn.innerText.trim();

        });

    });

    // -------- Number --------

    $$(".numberGrid button").forEach(btn=>{

        btn.addEventListener("click",()=>{

            $$(".numberGrid button").forEach(b=>{

                b.style.outline="none";

            });

            btn.style.outline="3px solid yellow";

            game.selectedNumber =
            Number(btn.innerText);

        });

    });

    // -------- BIG / SMALL --------

    const bigBtn = $(".bigBtn");
    const smallBtn = $(".smallBtn");

    if(bigBtn){

        bigBtn.onclick=()=>{

            game.selectedSize="BIG";

            bigBtn.style.outline="3px solid #00E5FF";
            smallBtn.style.outline="none";

        };

    }

    if(smallBtn){

        smallBtn.onclick=()=>{

            game.selectedSize="SMALL";

            smallBtn.style.outline="3px solid #00E5FF";
            bigBtn.style.outline="none";

        };

    }

                                    }
/* ===================================
   RWIN OFFICIAL ENGINE V2
   Part 3 - Play Engine
=================================== */

const playBtn = $("#playBtn");
const playStatus = $("#playStatus");

if (playBtn) {

    playBtn.addEventListener("click", () => {

        if (game.selectedBet <= 0) {
            playStatus.innerText = "❌ Select Practice Coins";
            return;
        }

        if (
            !game.selectedColor &&
            game.selectedNumber === null &&
            !game.selectedSize
        ) {
            playStatus.innerText = "❌ Select Color / Number / BIG-SMALL";
            return;
        }

        if (game.balance < game.selectedBet) {
            playStatus.innerText = "❌ Not Enough Practice Coins";
            return;
        }

        game.balance -= game.selectedBet;

        updateBalance();

        saveGame();

        playStatus.innerText =
        "✅ Bet Accepted : ₹" + game.selectedBet;

    });

}
/* ===================================
   RWIN OFFICIAL ENGINE V2
   Part 4 - Result Engine
=================================== */

function generateResult(){

    const number = Math.floor(Math.random() * 10);

    let color = "";

    if(number === 0 || number === 5){

        color = "VIOLET";

    }else if(number % 2 === 0){

        color = "RED";

    }else{

        color = "GREEN";

    }

    const size = number >= 5 ? "BIG" : "SMALL";

    $("#resultText").innerText =
    number + " (" + color + ")";

    return {
        number,
        color,
        size
    };

}

function finishRound(){

    const result = generateResult();

    let win = false;

    if(game.selectedColor === result.color){

        win = true;

    }

    if(game.selectedNumber === result.number){

        win = true;

    }

    if(game.selectedSize === result.size){

        win = true;

    }

    if(win){

        game.balance += game.selectedBet * 2;

        $("#statusText").innerText = "🎉 WIN";

    }else{

        $("#statusText").innerText = "❌ LOSE";

    }

    updateBalance();

    saveGame();

    game.selectedBet = 0;
    game.selectedColor = null;
    game.selectedNumber = null;
    game.selectedSize = null;

}

setInterval(()=>{

    if(game.timer === 0){

        finishRound();

    }

},1000);
