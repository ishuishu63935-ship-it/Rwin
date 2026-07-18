"use strict";

const planName =
document.getElementById("planName");

const planPrice =
document.getElementById("planPrice");

const payBtn =
document.getElementById("payNowBtn");

const plan =
localStorage.getItem("selectedPlan");

const price =
localStorage.getItem("selectedPrice");

planName.innerText = plan;

planPrice.innerText = "₹" + price;

payBtn.onclick = () => {

    alert(
        "Payment Gateway will be connected here."
    );

};
