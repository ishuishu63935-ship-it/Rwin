// ==========================
// RWIN V3 - Day 11
// ==========================

// Fade Effect
document.body.style.opacity = "0";

window.onload = () => {
    document.body.style.transition = "0.8s";
    document.body.style.opacity = "1";
};

// Countdown Timer

const timer = document.querySelector(".membershipCard h1");

if(timer){

let time = 30;

setInterval(()=>{

time--;

timer.innerHTML = time;

if(time<=0){

time=30;

}

},1000);

}

// Button Animation

const btns = document.querySelectorAll("button");

btns.forEach(btn=>{

btn.addEventListener("click",()=>{

btn.style.transform="scale(.95)";

btn.innerHTML="Loading...";

setTimeout(()=>{

btn.style.transform="scale(1)";

btn.innerHTML="Start Practice";

},1000);

});

});
const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click",()=>{

alert("Logout feature will be available after Login System is added.");

});

}
// Leaderboard Animation

const leaderCards=document.querySelectorAll(".leaderCard");

leaderCards.forEach((card,index)=>{

card.style.opacity="0";
card.style.transform="translateY(20px)";

setTimeout(()=>{

card.style.transition=".5s";
card.style.opacity="1";
card.style.transform="translateY(0)";

},index*200);

});
// Settings Demo

const settingInputs=document.querySelectorAll(".settingCard input");

settingInputs.forEach(input=>{

input.addEventListener("change",()=>{

console.log("Setting Changed");

});

});
// Home Animation

const cards=document.querySelectorAll(".actionCard");

cards.forEach((card,index)=>{

card.style.opacity="0";

card.style.transform="translateY(30px)";

setTimeout(()=>{

card.style.transition=".5s";

card.style.opacity="1";

card.style.transform="translateY(0)";

},index*150);

});
// Bottom Navigation Animation

const navItems=document.querySelectorAll(".navItem");

navItems.forEach(item=>{

item.addEventListener("click",()=>{

navItems.forEach(i=>i.classList.remove("active"));

item.classList.add("active");

});

});
let time = 30;

const timer = document.getElementById("timer");

if(timer){

setInterval(()=>{

time--;

if(time<0){

time=30;

}

timer.innerText=time;

},1000);

}
const allButtons=document.querySelectorAll(".colorGrid button,.numberGrid button");

allButtons.forEach(btn=>{

btn.addEventListener("click",()=>{

allButtons.forEach(b=>b.style.outline="none");

btn.style.outline="3px solid #00E5FF";

});

});
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginStatus = document.getElementById("loginStatus");

if(loginBtn){
loginBtn.addEventListener("click",()=>{
loginBtn.classList.add("loading");
loginStatus.innerText="⏳ Logging in...";

setTimeout(()=>{
loginBtn.classList.remove("loading");
loginStatus.innerText="✅ Ready for Firebase Login";
},1500);

});
}

if(signupBtn){
signupBtn.addEventListener("click",()=>{
loginStatus.innerText="📝 Signup feature coming next...";
});
}
// Loading Screen Redirect
if (
  window.location.pathname.endsWith("/") ||
  window.location.pathname.endsWith("index.html")
) {
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2500);
    
}

// ===============================
// RWIN ENGINE V1 - PART 1
// Timer + Selection Engine
// ===============================

// Timer
const gameTimer = document.getElementById("timer");

let roundTime = 30;

if (gameTimer) {

setInterval(() => {

roundTime--;

if (roundTime < 0) {

roundTime = 30;

startRound();

}

gameTimer.innerText = roundTime;

},1000);

}

// Selected Values
let selectedColor = "";
let selectedNumber = null;
let selectedSize = "";

// ----------------
// Color Buttons
// ----------------

const colorBtns=document.querySelectorAll(".colorGrid button");

colorBtns.forEach(btn=>{

btn.addEventListener("click",()=>{

colorBtns.forEach(b=>b.style.outline="none");

btn.style.outline="3px solid #00E5FF";

selectedColor=btn.innerText;

console.log("Color :",selectedColor);

});

});

// ----------------
// Number Buttons
// ----------------

const numberBtns=document.querySelectorAll(".numberGrid button");

numberBtns.forEach(btn=>{

btn.addEventListener("click",()=>{

numberBtns.forEach(b=>b.style.outline="none");

btn.style.outline="3px solid yellow";

selectedNumber=parseInt(btn.innerText);

console.log("Number :",selectedNumber);

});

});

// ----------------
// Big Small
// ----------------

const bigBtn=document.querySelector(".bigBtn");
const smallBtn=document.querySelector(".smallBtn");

if(bigBtn){

bigBtn.addEventListener("click",()=>{

selectedSize="BIG";

bigBtn.style.outline="3px solid white";
smallBtn.style.outline="none";

console.log(selectedSize);

});

}

if(smallBtn){

smallBtn.addEventListener("click",()=>{

selectedSize="SMALL";

smallBtn.style.outline="3px solid white";
bigBtn.style.outline="none";

console.log(selectedSize);

});

}

// ----------------
// Round
// ----------------

function startRound(){

const number=Math.floor(Math.random()*10);

let color="";

if(number==0 || number==5){

color="VIOLET";

}else if([1,3,7,9].includes(number)){

color="GREEN";

}else{

color="RED";

}

let size=(number>=5)?"BIG":"SMALL";

console.log("Result");

console.log("Number :",number);

console.log("Color :",color);

console.log("Size :",size);

}
