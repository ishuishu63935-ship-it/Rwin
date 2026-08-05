
"use strict";

const starterBtn = document.getElementById("buy21");
const proBtn = document.getElementById("buy60");
const eliteBtn = document.getElementById("buy365");

function openPayment(plan, price) {
    localStorage.setItem("selectedPlan", plan);
    localStorage.setItem("selectedPrice", price);
    window.location.href = "payment.html";
}

if (starterBtn) {
    starterBtn.onclick = () => {
        openPayment("Starter", 49);
    };
}

if (proBtn) {
    proBtn.onclick = () => {
        openPayment("Pro", 399);
    };
}

if (eliteBtn) {
    eliteBtn.onclick = () => {
        openPayment("Elite", 3999);
    };
}

// Update Membership Status Display
const statusBox = document.getElementById("membershipStatus");
if (statusBox) {
    const gameData = JSON.parse(localStorage.getItem("rwinGame")) || {};
    if (gameData.membership === true) {
        statusBox.innerText = "👑 " + (gameData.membershipPlan || "Active");
        statusBox.style.color = "#00FF66";
    } else {
        statusBox.innerText = "🆓 Free Plan";
        statusBox.style.color = "#FFD700";
    }
}

console.log("✅ Membership Ready");
