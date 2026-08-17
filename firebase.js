
    
// ================================
// RWIN OFFICIAL FIREBASE V3 - FIXED & SECURED
// ================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAedMCjwyX8yB-zK4hc0RgQ0LaziUj_4io",
  authDomain: "rwin-e6021.firebaseapp.com",
  projectId: "rwin-e6021",
  storageBucket: "rwin-e6021.firebasestorage.app",
  messagingSenderId: "677090984731",
  appId: "1:677090984731:web:f35ddadf5cc931ee17c9be"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const status = document.getElementById("loginStatus");

function getDeviceId() {
    let deviceId = localStorage.getItem('rwin_device_id');
    if (!deviceId) {
        deviceId = 'DEV_' + Math.random().toString(36).substr(2, 9) + Date.now();
        localStorage.setItem('rwin_device_id', deviceId);
    }
    return deviceId;
}

// SIGNUP
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    try {
      const deviceId = getDeviceId();
      const deviceRef = doc(db, "device_registry", deviceId);
      const deviceDoc = await getDoc(deviceRef);

      let initialBalance = 10000;
      let claimedCoins = true;

      if (deviceDoc.exists()) {
        alert("⚠️ इस डिवाइस पर फ्री 10,000 कॉइन्स पहले ही लिए जा चुके हैं! आपका अकाउंट 0 कॉइन्स से शुरू होगा।");
        initialBalance = 0;
        claimedCoins = false;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value.trim(),
        password.value
      );
      const user = userCredential.user;

      const initialData = {
        email: user.email,
        balance: initialBalance,
        xp: 0,
        level: 1,
        membership: false,
        membershipPlan: "Free",
        membershipExpiry: null,
        hasClaimedFreeCoins: claimedCoins,
        history: [],
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "users", user.uid), initialData);

      if (!deviceDoc.exists()) {
        await setDoc(deviceRef, {
          claimed: true,
          claimedByEmail: user.email,
          createdAt: new Date().toISOString()
        });
      }

      localStorage.setItem("rwinGame", JSON.stringify(initialData));
      localStorage.setItem("rwinCloud", JSON.stringify(initialData));

      if(status) status.innerHTML = "✅ Account Created Successfully";
      alert("Welcome to RWIN 🎉");
      window.location.href = "home.html";
    } catch (error) {
      console.error(error);
      if(status) status.innerHTML = error.message;
      alert(error.message);
    }
  });
}

// LOGIN
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value.trim(),
        password.value
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const cloudData = userDoc.data();
        localStorage.setItem("rwinGame", JSON.stringify(cloudData));
        localStorage.setItem("rwinCloud", JSON.stringify(cloudData));
      }

      if(status) status.innerHTML = "✅ Login Successful";
      alert("Welcome Back 😎");
      window.location.href = "home.html";
    } catch (error) {
      console.error(error);
      if(status) status.innerHTML = error.message;
      alert(error.message);
    }
  });
}
