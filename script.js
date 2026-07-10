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

 
