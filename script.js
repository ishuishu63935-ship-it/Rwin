// ================================
// RWIN V1 ENGINE - PART 1
// ================================

// Game Variables
let balance = 10000;
let xp = 0;

let selectedColor = "";
let selectedNumber = null;
let selectedSize = "";

let roundTime = 30;

// Elements
const timer = document.getElementById("timer");
const balanceText = document.querySelector(".balanceCard h1");

// Update Balance
function updateBalance(){

if(balanceText){

balanceText.innerHTML = "₹" + balance;

}

}

// Countdown
if(timer){

setInterval(()=>{

roundTime--;

if(roundTime < 0){

roundTime = 30;

}

timer.innerHTML = roundTime;

},1000);

}

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
// ===============================
// RWIN ENGINE V1 - PART 2
// Balance + XP + Result
// ===============================

// Virtual Balance
let balance = 10000;

// XP
let xp = 0;

// Result History
let history = [];

// Update UI
function updateGameUI() {

const balanceCard = document.querySelector(".balanceCard h1");

if(balanceCard){
balanceCard.innerHTML = "₹" + balance;
}

const xpText = document.querySelector(".levelPanel p:last-child");

if(xpText){
xpText.innerHTML = "XP : " + xp + " / 100";
}

const xpFill = document.querySelector(".xpFill");

if(xpFill){
xpFill.style.width = xp + "%";
}

}

// Round Result
function finishRound(number,color,size){

let win=false;

// Color Check
if(selectedColor!="" && selectedColor==color){

balance+=100;

xp+=10;

win=true;

}

// Number Check
if(selectedNumber!==null && selectedNumber==number){

balance+=200;

xp+=20;

win=true;

}

// Big Small Check
if(selectedSize!="" && selectedSize==size){

balance+=100;

xp+=10;

win=true;

}

if(!win){

balance-=100;

if(balance<0){
balance=0;
}

}

history.unshift(

"Result : "+number+
" | "+color+
" | "+size

);

if(history.length>5){

history.pop();

}

const recent=document.querySelector(".recentCard");

if(recent){

recent.innerHTML="";

history.forEach(item=>{

recent.innerHTML+="<p>"+item+"</p>";

});

}

updateGameUI();

}

// Replace startRound()
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

finishRound(number,color,size);

}

// First Load
updateGameUI();
// ===============================
// RWIN ENGINE V1 - PART 3
// Level + Save Data + Popup
// ===============================

// Selected Values
let selectedColor = "";
let selectedNumber = null;
let selectedSize = "";

// Color Select
document.querySelectorAll(".colorGrid button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedColor = btn.innerText.trim().toUpperCase();
  });
});

// Number Select
document.querySelectorAll(".numberGrid button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedNumber = parseInt(btn.innerText);
  });
});

// Big Small
const bigBtn = document.querySelector(".bigBtn");
const smallBtn = document.querySelector(".smallBtn");

if(bigBtn){
bigBtn.onclick = () => {
selectedSize = "BIG";
};
}

if(smallBtn){
smallBtn.onclick = () => {
selectedSize = "SMALL";
};
}

// Local Save
function saveGame(){

localStorage.setItem("rwin_balance",balance);
localStorage.setItem("rwin_xp",xp);

}

// Load
function loadGame(){

const b = localStorage.getItem("rwin_balance");
const x = localStorage.getItem("rwin_xp");

if(b!==null) balance = Number(b);
if(x!==null) xp = Number(x);

updateGameUI();

}

loadGame();

// Auto Save
setInterval(saveGame,1000);

// Level
function updateLevel(){

const levelText=document.querySelector(".levelPanel p");

if(!levelText) return;

if(xp>=300){

levelText.innerHTML="Level 4 - Gold";

}else if(xp>=200){

levelText.innerHTML="Level 3 - Silver";

}else if(xp>=100){

levelText.innerHTML="Level 2 - Bronze";

}else{

levelText.innerHTML="Level 1 - Beginner";

}

}

setInterval(updateLevel,500);

// Popup
function showPopup(text){

const div=document.createElement("div");

div.innerHTML=text;

div.style.position="fixed";
div.style.top="30px";
div.style.left="50%";
div.style.transform="translateX(-50%)";
div.style.background="#00E5FF";
div.style.color="#000";
div.style.padding="15px 25px";
div.style.borderRadius="12px";
div.style.fontWeight="bold";
div.style.zIndex="9999";

document.body.appendChild(div);

setTimeout(()=>{
div.remove();
},2000);

}

// Buttons
document.querySelectorAll(
".colorGrid button,.numberGrid button,.bigBtn,.smallBtn"
).forEach(btn=>{

btn.addEventListener("click",()=>{

showPopup("Prediction Saved");

});

});
// ================================
// RWIN V1 ENGINE - PART 2
// ================================

// Color Buttons
document.querySelectorAll(".colorGrid button").forEach(btn=>{

btn.addEventListener("click",()=>{

selectedColor=btn.innerText.trim().toUpperCase();

document.querySelectorAll(".colorGrid button").forEach(b=>{
b.style.outline="none";
});

btn.style.outline="3px solid #00E5FF";

console.log("Color :",selectedColor);

});

});

// Number Buttons
document.querySelectorAll(".numberGrid button").forEach(btn=>{

btn.addEventListener("click",()=>{

selectedNumber=parseInt(btn.innerText);

document.querySelectorAll(".numberGrid button").forEach(b=>{
b.style.outline="none";
});

btn.style.outline="3px solid yellow";

console.log("Number :",selectedNumber);

});

});

// Big Small
const big=document.querySelector(".bigBtn");
const small=document.querySelector(".smallBtn");

if(big){

big.onclick=()=>{

selectedSize="BIG";

big.style.outline="3px solid #00E5FF";
small.style.outline="none";

console.log(selectedSize);

};

}

if(small){

small.onclick=()=>{

selectedSize="SMALL";

small.style.outline="3px solid #00E5FF";
big.style.outline="none";

console.log(selectedSize);

};

    }
// ================================
// RWIN V1 ENGINE - PART 3
// Result Engine
// ================================

// Result Box
const recentCard = document.querySelector(".recentCard");

// Random Result
function generateResult(){

const number = Math.floor(Math.random()*10);

let color="";

if(number==0 || number==5){

color="VIOLET";

}else if([1,3,7,9].includes(number)){

color="GREEN";

}else{

color="RED";

}

const size = number>=5 ? "BIG" : "SMALL";

// Check Win
let win=false;

if(selectedColor===color) win=true;

if(selectedNumber===number) win=true;

if(selectedSize===size) win=true;

// Balance
if(win){

balance+=100;
xp+=10;

}else{

balance-=100;

if(balance<0){
balance=0;
}

}

// Update Balance
updateBalance();

// Show Result
if(recentCard){

recentCard.innerHTML=
`
<p>🎯 Number : ${number}</p>
<p>🎨 Color : ${color}</p>
<p>📏 Size : ${size}</p>
<p>${win?"✅ YOU WIN":"❌ YOU LOSE"}</p>
`;

}

console.log(number,color,size);

}

// Every 30 Seconds
if(timer){

setInterval(()=>{

if(roundTime===0){

generateResult();

}

},1000);

    }
