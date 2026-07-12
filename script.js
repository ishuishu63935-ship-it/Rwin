"use strict";

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
