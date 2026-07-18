
alert("membership.js loaded");

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

console.log("✅ Membership Ready");
