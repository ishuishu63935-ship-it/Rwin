
import { auth, db, rtdb } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const planName = document.getElementById("planName");
const planPrice = document.getElementById("planPrice");
const payBtn = document.getElementById("payNowBtn");
const utrInput = document.getElementById("utrInput");
const upiQrCode = document.getElementById("upiQrCode");

const plan = localStorage.getItem("selectedPlan") || "Starter";
const price = localStorage.getItem("selectedPrice") || "49";
const upiId = "7415325460-2@ibl";

// 1. Fixed Amount UPI QR Generator URL
const upiString = `upi://pay?pa=${upiId}&pn=RWIN&am=${price}&cu=INR`;
const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;

if (planName) planName.innerText = plan + " Plan";
if (planPrice) planPrice.innerText = "₹" + price;
if (upiQrCode) upiQrCode.src = qrApiUrl;

let currentUser = null;

// Auth Check
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    alert("⚠️ कृपया पहले लॉगिन करें!");
    window.location.href = "login.html";
  }
});

// UTR Verification
payBtn.addEventListener("click", async () => {
  const utr = utrInput.value.trim();

  if (!utr || utr.length < 6) {
    alert("⚠️ कृपया सही 12-अंकों का UTR / Ref नंबर डालें!");
    return;
  }

  if (!currentUser) {
    alert("⚠️ यूज़र सेशन नहीं मिला!");
    return;
  }

  payBtn.disabled = true;
  payBtn.innerText = "Verifying...";

  try {
    const smsRef = ref(rtdb, 'sms');
    const snapshot = await get(smsRef);
    
    let isMatched = false;

    if (snapshot.exists()) {
      const smsData = snapshot.val();
      
      Object.values(smsData).forEach((smsObj) => {
        const fullText = typeof smsObj === 'object' ? JSON.stringify(smsObj) : String(smsObj);
        
        // Match both UTR and ensure SMS received
        if (fullText.includes(utr)) {
          isMatched = true;
        }
      });
    }

    if (isMatched) {
      const userRef = doc(db, "users", currentUser.uid);

      const updatedFields = {
        membership: true,
        membershipPlan: plan,
        membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentStatus: "SUCCESS",
        lastUtr: utr
      };

      await updateDoc(userRef, updatedFields);

      // LocalStorage update
      const localData = JSON.parse(localStorage.getItem("rwinGame") || "{}");
      Object.assign(localData, updatedFields);
      localStorage.setItem("rwinGame", JSON.stringify(localData));
      localStorage.setItem("rwinCloud", JSON.stringify(localData));

      alert("🎉 पेमेंट वेरीफ़ाई हो गया! आपकी मेंबरशिप चालू कर दी गई है।");
      window.location.href = "membership.html";
    } else {
      alert("❌ UTR मैच नहीं हुआ! कृपया 1 मिनट रुककर दोबारा कोशिश करें।");
    }
  } catch (error) {
    console.error("Verification Error:", error);
    alert("⚠️ त्रुटि: " + error.message);
  } finally {
    payBtn.disabled = false;
    payBtn.innerText = "Verify & Activate";
  }
});
    
