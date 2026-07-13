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
