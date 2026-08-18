// ================================
// RWIN OFFICIAL FIREBASE V4 - HARDWARE FINGERPRINT & REALTIME FIX
// ================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getDatabase
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAedMCjwyX8yB-zK4hc0RgQ0LaziUj_4io",
  authDomain: "rwin-e6021.firebaseapp.com",
  projectId: "rwin-e6021",
  storageBucket: "rwin-e6021.firebasestorage.app",
  messagingSenderId: "677090984731",
  appId: "1:677090984731:web:f35ddadf5cc931ee17c9be",
  databaseURL: "https://rwin-e6021-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const status = document.getElementById("loginStatus");

// 🔒 HARDWARE FINGERPRINT (Storage clear karne par bhi ID badlegi nahi)
function getDeviceId() {
    const raw = navigator.userAgent + screen.width + "x" + screen.height + navigator.language;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        hash = (hash << 5) - hash + raw.charCodeAt(i);
        hash |= 0;
    }
    return 'DEV_HW_' + Math.abs(hash);
}

// 🔄 CLOUD SYNC FUNCTION
window.syncRwinToCloud = async (gameData) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        balance: gameData.balance,
        xp: gameData.xp,
        level: gameData.level,
        membership: gameData.membership,
        membershipPlan: gameData.membershipPlan,
        membershipExpiry: gameData.membershipExpiry,
        history: gameData.history || []
      }, { merge: true });
    } catch (err) {
      console.error("Cloud sync failed:", err);
    }
  }
};

// AUTO-FETCH LATEST CLOUD DATA ON AUTH STATE CHANGE
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const cloudData = userDoc.data();
      localStorage.setItem("rwinGame", JSON.stringify(cloudData));
      localStorage.setItem("rwinCloud", JSON.stringify(cloudData));
      
      // Update script memory if game script is active
      if (window.loadRwinFromCloud && typeof window.loadRwinFromCloud === 'function') {
        window.loadRwinFromCloud(cloudData);
      }
    }
  }
});

// SIGNUP
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    try {
      if (!email.value || !password.value) {
        alert("Please enter email and password");
        return;
      }

      const deviceId = getDeviceId();
      const deviceRef = doc(db, "device_registry", deviceId);
      const deviceDoc = await getDoc(deviceRef);

      let initialBalance = 10000;
      let claimedCoins = true;

      if (deviceDoc.exists()) {
        alert("⚠️ Is device par FREE 10,000 coins pehle hi liye ja chuke hain! Aapka account 0 coins se start hoga.");
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
      if (!email.value || !password.value) {
        alert("Please enter email and password");
        return;
      }

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
