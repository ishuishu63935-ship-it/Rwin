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
