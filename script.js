// =====================================
// RWIN V1 - SCRIPT ENGINE
// Part 1 - App Foundation
// =====================================

"use strict";

console.log("🚀 RWIN Script Loaded");

// ---------- Page Detection ----------
const isLoginPage =
  document.getElementById("loginBtn") !== null;

const isHomePage =
  document.querySelector(".menuGrid") !== null;

const isGamePage =
  document.getElementById("timer") !== null;

// ---------- Global Game Data ----------
const game = {
  balance: 10000,
  xp: 0,
  level: 1,

  timer: 30,

  selectedColor: null,
  selectedNumber: null,
  selectedSize: null,

  history: []
};

// ---------- Utility ----------
function $(selector){
  return document.querySelector(selector);
}

function $all(selector){
  return document.querySelectorAll(selector);
}

// ---------- Balance ----------
function updateBalance(){

  const balanceText = $(".balanceCard h1");

  if(balanceText){

    balanceText.innerText =
      "₹" + game.balance;

 
// =====================================
// RWIN V1 - SCRIPT ENGINE
// Part 2 - Login + Home
// =====================================

// ---------- LOGIN PAGE ----------
if (isLoginPage) {

  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const status = document.getElementById("loginStatus");

  if (loginBtn) {

    loginBtn.addEventListener("click", () => {

      if (status) {
        status.innerHTML = "⏳ Logging in...";
      }

    });

  }

  if (signupBtn) {

    signupBtn.addEventListener("click", () => {

      if (status) {
        status.innerHTML = "📝 Creating Account...";
      }

    });

  }

}

// ---------- HOME PAGE ----------
if (isHomePage) {

  updateBalance();

  const cards = $all(".menuBox");

  cards.forEach((card, index) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(25px)";

    setTimeout(() => {

      card.style.transition = ".4s";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";

    }, index * 120);

  });

}
// =====================================
// RWIN V1 - SCRIPT ENGINE
// Part 3 - Game Engine
// =====================================

if (isGamePage) {

  updateBalance();

  const timerText = document.getElementById("timer");

  // Timer
  setInterval(() => {

    game.timer--;

    if (game.timer < 0) {
      game.timer = 30;
    }

    if (timerText) {
      timerText.innerText = game.timer;
    }

  }, 1000);

  // Color Selection
  $all(".colorGrid button").forEach(btn => {

    btn.addEventListener("click", () => {

      game.selectedColor = btn.innerText.trim();

      $all(".colorGrid button").forEach(b => {
        b.style.outline = "none";
      });

      btn.style.outline = "3px solid #00E5FF";

      console.log("Color:", game.selectedColor);

    });

  });

  // Number Selection
  $all(".numberGrid button").forEach(btn => {

    btn.addEventListener("click", () => {

      game.selectedNumber = Number(btn.innerText);

      $all(".numberGrid button").forEach(b => {
        b.style.outline = "none";
      });

      btn.style.outline = "3px solid yellow";

      console.log("Number:", game.selectedNumber);

    });

  });

  // Big / Small
  const bigBtn = $(".bigBtn");
  const smallBtn = $(".smallBtn");

  if (bigBtn) {

    bigBtn.addEventListener("click", () => {

      game.selectedSize = "BIG";

      bigBtn.style.outline = "3px solid #00E5FF";
      smallBtn.style.outline = "none";

      console.log(game.selectedSize);

    });

  }

  if (smallBtn) {

    smallBtn.addEventListener("click", () => {

      game.selectedSize = "SMALL";

      smallBtn.style.outline = "3px solid #00E5FF";
      bigBtn.style.outline = "none";

      console.log(game.selectedSize);

    });

  }

                         }
// =====================================
// RWIN V1 - SCRIPT ENGINE
// Part 4 - Result Engine
// =====================================

function playRound() {

  if (!isGamePage) return;

  // Random Number
  const number = Math.floor(Math.random() * 10);

  // Color Logic
  let color = "";

  if (number === 0 || number === 5) {

    color = "VIOLET";

  } else if ([1,3,7,9].includes(number)) {

    color = "GREEN";

  } else {

    color = "RED";

  }

  // Size Logic
  const size = number >= 5 ? "BIG" : "SMALL";

  // Save History
  game.history.unshift({
    number,
    color,
    size
  });

  if (game.history.length > 10) {
    game.history.pop();
  }

  // Update Recent Activity
  const recent = document.querySelector(".recentCard");

  if (recent) {

    recent.innerHTML = "";

    game.history.forEach(item => {

      recent.innerHTML += `
      <p>
      🎯 ${item.number}
      |
      ${item.color}
      |
      ${item.size}
      </p>
      `;

    });

  }

  console.log("Result:", number, color, size);

}

// Auto Play Every 30 Seconds
if (isGamePage) {

  setInterval(() => {

    if (game.timer === 0) {

      playRound();

    }

  }, 1000);

                            }
// =====================================
// RWIN V1 - SCRIPT ENGINE
// Part 5 - Membership + Save
// =====================================

// Membership (Demo)
game.membership = true;

// Reset Practice Coins
function resetPracticeCoins(){

  if(!game.membership){
    alert("Membership Expired");
    return;
  }

  game.balance = 10000;
  updateBalance();
  saveGame();

  alert("✅ Practice Coins Reset to ₹10,000");

}

// Save
function saveGame(){

  localStorage.setItem("rwin_game",JSON.stringify(game));

}

// Load
function loadGame(){

  const data = localStorage.getItem("rwin_game");

  if(data){

    const saved = JSON.parse(data);

    game.balance = saved.balance ?? 10000;
    game.xp = saved.xp ?? 0;
    game.level = saved.level ?? 1;
    game.history = saved.history ?? [];

    updateBalance();

  }

}

loadGame();

// Auto Save
setInterval(saveGame,3000);

console.log("✅ Membership Engine Ready");
    // =====================================
// RWIN GAME ENGINE - PART 1
// Bet Engine
// =====================================

let selectedBet = 0;

const betButtons = document.querySelectorAll(".betBtn");
const betStatus = document.getElementById("betStatus");

betButtons.forEach(btn=>{

btn.addEventListener("click",()=>{

betButtons.forEach(b=>{

b.style.outline="none";

});

btn.style.outline="3px solid #00E5FF";

selectedBet = Number(btn.innerText);

if(betStatus){

betStatus.innerText =
"Selected : ₹"+selectedBet;

}

});

});
    
// =====================================
// RWIN GAME ENGINE - PART 2
// Start Practice
// =====================================

const playBtn = document.getElementById("playBtn");
const playStatus = document.getElementById("playStatus");

if(playBtn){

playBtn.addEventListener("click",()=>{

// Bet Check
if(selectedBet===0){

playStatus.innerText="❌ Select Practice Coins";
return;

}

// Color / Number / Big-Small Check

if(
!game.selectedColor &&
game.selectedNumber===null &&
!game.selectedSize
){

playStatus.innerText="❌ Select Color, Number or BIG/SMALL";
return;

}

playStatus.innerText="⏳ Waiting For Next Round...";

});

}
    // =====================================
// RWIN GAME ENGINE - PART 3
// Random Result Engine
// =====================================

const resultText = document.getElementById("resultText");
const statusText = document.getElementById("statusText");

function generateResult(){

    const result = Math.floor(Math.random() * 10);

    let color = "";

    if(result == 0 || result == 5){

        color = "VIOLET";

    }else if(result % 2 == 0){

        color = "RED";

    }else{

        color = "GREEN";

    }

    if(resultText){

        resultText.innerHTML =
        `${result} (${color})`;

    }

    if(statusText){

        statusText.innerHTML =
        "Round Completed";

    }

    return {

        number:result,
        color:color

    };

}
    // Run Result when Timer Ends

setInterval(()=>{

    if(game.timer===0){

        generateResult();

    }

},1000);
