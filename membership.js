import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const starterBtn = document.getElementById("buy21");
const proBtn = document.getElementById("buy60");
const eliteBtn = document.getElementById("buy365");
const statusBox = document.getElementById("membershipStatus");

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

// Live Membership Status Checker
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                
                // LocalStorage ko update kar do
                const localData = JSON.parse(localStorage.getItem("rwinGame") || "{}");
                Object.assign(localData, userData);
                localStorage.setItem("rwinGame", JSON.stringify(localData));
                localStorage.setItem("rwinCloud", JSON.stringify(localData));

                // UI update karo
                updateStatusUI(userData);
            } else {
                updateStatusUIFromLocal();
            }
        } catch (error) {
            console.error("Status fetch error:", error);
            updateStatusUIFromLocal();
        }
    } else {
        updateStatusUIFromLocal();
    }
});

function updateStatusUI(data) {
    if (statusBox) {
        if (data && data.membership === true) {
            statusBox.innerText = "👑 " + (data.membershipPlan || "Active VIP");
            statusBox.style.color = "#00FF66";
        } else {
            statusBox.innerText = "🆓 Free Plan";
            statusBox.style.color = "#FFD700";
        }
    }
}

function updateStatusUIFromLocal() {
    if (statusBox) {
        const gameData = JSON.parse(localStorage.getItem("rwinGame")) || {};
        updateStatusUI(gameData);
    }
}

console.log("✅ Membership Script Connected");
