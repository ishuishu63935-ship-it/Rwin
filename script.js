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
