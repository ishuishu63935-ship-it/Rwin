import { auth, db, rtdb } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const planName = document.getElementById("planName");
const planPrice = document.getElementById("planPrice");
const payBtn = document.getElementById("payNowBtn");
const utrInput = document.getElementById("utrInput");

const plan = localStorage.getItem("selectedPlan") || "VIP Membership";
const price = localStorage.getItem("selectedPrice") || "100";

if (planName) planName.innerText = plan;
if (planPrice) planPrice.innerText = "₹" + price;

let currentUser = null;

// Check user login status
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    alert("⚠️ Kripya pehle login karein!");
    window.location.href = "login.html";
  }
});

payBtn.addEventListener("click", async () => {
  const utr = utrInput.value.trim();

  if (!utr || utr.length < 6) {
    alert("⚠️ Kripya sahi UTR / Transaction ID daalein!");
    return;
  }

  if (!currentUser) {
    alert("⚠️ User logged in nahi hai.");
    return;
  }

  payBtn.disabled = true;
  payBtn.innerText = "Verifying...";

  try {
    // 1. Realtime Database se SMS fetch karo
    const smsRef = ref(rtdb, 'sms');
    const snapshot = await get(smsRef);
    
    let isMatched = false;

    if (snapshot.exists()) {
      const smsData = snapshot.val();
      
      // Check if UTR exists in any received SMS
      Object.values(smsData).forEach((smsObj) => {
        const fullText = typeof smsObj === 'object' ? JSON.stringify(smsObj) : String(smsObj);
        
        if (fullText.includes(utr)) {
          isMatched = true;
        }
      });
    }

    // 2. Agar UTR match ho gaya toh membership activate karo
    if (isMatched) {
      const userRef = doc(db, "users", currentUser.uid);

      const updatedFields = {
        membership: true,
        membershipPlan: plan,
        membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Days Valid
        paymentStatus: "SUCCESS",
        lastUtr: utr
      };

      await updateDoc(userRef, updatedFields);

      // Local storage update
      const localData = JSON.parse(localStorage.getItem("rwinGame") || "{}");
      Object.assign(localData, updatedFields);
      localStorage.setItem("rwinGame", JSON.stringify(localData));
      localStorage.setItem("rwinCloud", JSON.stringify(localData));

      alert("🎉 Payment Verify Ho Gaya! Aapki Membership Active Kar Di Gayi Hai.");
      window.location.href = "membership.html";
    } else {
      alert("❌ UTR Match Nahi Hua! Agar Payment Kar Diya Hai To 1 Minute Baad Dobara Try Karein.");
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    alert("⚠️ Verification Error: " + error.message);
  } finally {
    payBtn.disabled = false;
    payBtn.innerText = "Verify & Activate";
  }
});

