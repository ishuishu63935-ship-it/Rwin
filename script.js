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
