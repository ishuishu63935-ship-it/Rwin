
// ================================
// RWIN OFFICIAL FIREBASE V3 - FIXED
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

console.log("✅ Firebase Ready");

// SIGNUP
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value.trim(),
        password.value
      );
      const user = userCredential.user;

      const initialData = {
        email: user.email,
        balance: 10000,
        xp: 0,
        level: 1,
        membership: false,
        membershipPlan: "Free",
        membershipExpiry: null,
        history: [],
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "users", user.uid), initialData);

      // Synchronize LocalStorage
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
      } else {
        const defaultData = {
          email: user.email,
          balance: 10000,
          xp: 0,
          level: 1,
          membership: false,
          membershipPlan: "Free",
          membershipExpiry: null,
          history: []
        };
        localStorage.setItem("rwinGame", JSON.stringify(defaultData));
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
    
